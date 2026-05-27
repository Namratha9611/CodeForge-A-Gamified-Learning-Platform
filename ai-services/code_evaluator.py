import subprocess
import tempfile
import os
import json
import re
import sys
from typing import List, Dict, Any

class CodeEvaluator:
    def __init__(self):
        self.timeout = 10  # seconds
        
    def evaluate(self, code: str, language: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Evaluate code against test cases"""
        # Normalize line endings
        code = code.replace('\r\n', '\n').replace('\r', '\n')
        
        try:
            # Skip execution for SQL queries (they're handled in backend)
            if language.lower() in ['sql', 'dbms'] or 'SELECT' in code.upper():
                return {
                    "success": False,
                    "message": "SQL queries should be validated in the backend, not executed as code",
                    "score": 0
                }
            
            # Execute code - initial validation
            initial_code = code
            if language in ["java", "cpp"] and "main" not in code:
                first_input = test_cases[0].get("input", {}) if test_cases else {}
                initial_code = self._create_test_wrapper(code, language, first_input)
                
            execution_result = self._execute_code(initial_code, language)
            
            if not execution_result["success"]:
                return {
                    "success": False,
                    "message": "Code execution failed",
                    "error": execution_result.get("error", "Unknown error"),
                    "output": execution_result.get("output", ""),
                    "score": 0
                }
            
            # Run test cases
            passed = 0
            total = len(test_cases)
            failed_tests = []
            
            for i, test_case in enumerate(test_cases):
                input_data = test_case.get("input", "")
                expected = test_case.get("expectedOutput", "")
                
                # Create test wrapper
                test_code = self._create_test_wrapper(code, language, input_data)
                test_result = self._execute_code(test_code, language)
                
                if test_result["success"]:
                    output = test_result.get("output", "").strip()
                    if self._compare_output(output, expected):
                        passed += 1
                    else:
                        failed_tests.append({
                            "testCase": i + 1,
                            "input": input_data,
                            "expected": expected,
                            "got": output
                        })
                else:
                    failed_tests.append({
                        "testCase": i + 1,
                        "error": test_result.get("error", "Execution failed")
                    })
            
            score = int((passed / total) * 100) if total > 0 else 0
            success = passed == total
            
            feedback = f"Passed {passed}/{total} test cases"
            if not success:
                feedback += f". Failed tests: {failed_tests[:3]}"  # Show first 3 failures
            
            return {
                "success": success,
                "message": "All tests passed!" if success else feedback,
                "score": score,
                "passed": passed,
                "total": total,
                "output": execution_result.get("output", ""),
                "feedback": feedback
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Evaluation error: {str(e)}",
                "score": 0
            }
    
    def _execute_code(self, code: str, language: str) -> Dict[str, Any]:
        """Execute code in sandboxed environment"""
        try:
            if language == "python":
                return self._run_python(code)
            elif language == "java":
                return self._run_java(code)
            elif language == "cpp":
                return self._run_cpp(code)
            elif language == "javascript":
                return self._run_javascript(code)
            else:
                return {"success": False, "error": f"Unsupported language: {language}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _run_python(self, code: str) -> Dict[str, Any]:
        """Run Python code"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            result = subprocess.run(
                [sys.executable, temp_file],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Execution timeout"}
        except Exception as e:
            return {"success": False, "error": str(e)}
        finally:
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    def _run_java(self, code: str) -> Dict[str, Any]:
        """Run Java code"""
        # Extract class name from code - more lenient
        class_match = re.search(r'class\s+(\w+)', code)
        class_name = class_match.group(1) if class_match else "Solution"
        
        # Ensure it has a class wrapper if it looks like just methods
        if not class_match:
            code = f"public class {class_name} {{\n{code}\n}}"
            
        temp_dir = tempfile.mkdtemp()
        java_file = os.path.join(temp_dir, f"{class_name}.java")
        
        try:
            with open(java_file, 'w') as f:
                f.write(code)
            
            # Compile
            compile_result = subprocess.run(
                ['javac', java_file],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=temp_dir
            )
            
            if compile_result.returncode != 0:
                return {
                    "success": False,
                    "error": compile_result.stderr
                }
            
            # Run
            # If we created a TestWrapper class, we must call it instead of class_name
            actual_main_class = "TestWrapper" if "class TestWrapper" in code else class_name
            run_result = subprocess.run(
                ['java', '-cp', temp_dir, actual_main_class],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=temp_dir
            )
            
            return {
                "success": run_result.returncode == 0,
                "output": run_result.stdout,
                "error": run_result.stderr if run_result.returncode != 0 else None
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Execution timeout"}
        except Exception as e:
            return {"success": False, "error": str(e)}
        finally:
            import shutil
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
    
    def _run_cpp(self, code: str) -> Dict[str, Any]:
        """Run C++ code"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.cpp', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        exe_file = temp_file.replace('.cpp', '.exe' if os.name == 'nt' else '')
        
        try:
            # Compile
            compile_result = subprocess.run(
                ['g++', temp_file, '-o', exe_file],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            if compile_result.returncode != 0:
                return {
                    "success": False,
                    "error": compile_result.stderr
                }
            
            # Run
            run_result = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            return {
                "success": run_result.returncode == 0,
                "output": run_result.stdout,
                "error": run_result.stderr if run_result.returncode != 0 else None
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Execution timeout"}
        except Exception as e:
            return {"success": False, "error": str(e)}
        finally:
            for f in [temp_file, exe_file]:
                if os.path.exists(f):
                    os.unlink(f)
    
    def _run_javascript(self, code: str) -> Dict[str, Any]:
        """Run JavaScript code"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            result = subprocess.run(
                ['node', temp_file],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Execution timeout"}
        except Exception as e:
            return {"success": False, "error": str(e)}
        finally:
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    def _create_test_wrapper(self, code: str, language: str, input_data: Any) -> str:
        """Create test wrapper for code"""
        if language == "python":
            func_match = re.search(r'def\s+(\w+)\s*\(', code)
            func_name = func_match.group(1) if func_match else 'solution'
            
            # If no function defined, wrap raw code in one
            if not func_match:
                params = ", ".join(input_data.keys()) if isinstance(input_data, dict) else "n"
                indented_code = "\n".join(["    " + line for line in code.split("\n")])
                code = f"def {func_name}({params}):\n{indented_code}"
                
            args = self._format_args(input_data, "python")
            return f"{code}\n\nprint({func_name}({args}))"

        elif language == "javascript":
            func_match = re.search(r'function\s+(\w+)\s*\(', code)
            func_name = func_match.group(1) if func_match else 'solution'
            
            # If no function defined, wrap raw code
            if not func_match:
                params = ", ".join(input_data.keys()) if isinstance(input_data, dict) else "n"
                code = f"function {func_name}({params}) {{\n{code}\n}}"
                
            args = self._format_args(input_data, "javascript")
            return f"{code}\n\nconsole.log(JSON.stringify({func_name}({args})));"

        elif language == "java":
            class_match = re.search(r'class\s+(\w+)', code)
            class_name = class_match.group(1) if class_match else "Solution"
            method_pattern = r'(?:public|private|protected|static|\s)+(void|int|double|String|boolean|Object|[\w<>\d\[\]]+)\s+([\w\d]+)\s*\('
            func_match = re.search(method_pattern, code)
            
            if func_match and func_match.group(2) in ['if', 'for', 'while', 'switch', 'synchronized', 'main']:
                func_match = None
                
            func_name = func_match.group(2) if func_match else "solution"
            ret_type_captured = func_match.group(1) if func_match else None
            
            args = self._format_args(input_data, "java")
            has_main = "public static void main" in code
            
            if has_main:
                return code

            code = code.strip()
            
            # Create a string representation of input for Scanner
            scanner_input = ""
            if isinstance(input_data, dict):
                for val in input_data.values():
                    if isinstance(val, list):
                        scanner_input += str(len(val)) + " " + " ".join(map(str, val)) + " "
                    else:
                        scanner_input += str(val) + " "
            else:
                scanner_input = str(input_data)
            
            scanner_setup = f'String input = "{scanner_input.strip()}";\n        Scanner sc = new Scanner(input);'

            # Logic for wrapping
            if class_match:
                # User provided a class. We'll append a separate TestWrapper class
                # to avoid splicing the user's class with rfind.
                is_void = ret_type_captured == "void" if ret_type_captured else (re.search(r'\breturn\b', code) is None)
                call_line = f"sol.{func_name}({args});" if is_void else f"System.out.println(sol.{func_name}({args}));"
                
                return f"""
import java.util.*;
{code}

class TestWrapper {{
    public static void main(String[] args) {{
        {scanner_setup}
        {class_name} sol = new {class_name}();
        {call_line}
    }}
}}
"""
            
            if func_match:
                # User provided ONLY a method.
                is_void = ret_type_captured == "void"
                call_line = f"sol.{func_name}({args});" if is_void else f"System.out.println(sol.{func_name}({args}));"
                return f"""
import java.util.*;
public class {class_name} {{
{code}
    public static void main(String[] args) {{
        {scanner_setup}
        {class_name} sol = new {class_name}();
        {call_line}
    }}
}}
"""

            # Raw statements (script style)
            params = []
            if isinstance(input_data, dict):
                for k, v in input_data.items():
                    params.append(f"{self._guess_java_type(v)} {k}")
            else:
                params.append("int n") # fallback
            
            param_str = ", ".join(params)
            has_return = re.search(r'\breturn\b', code) is not None
            ret_type = "Object" if has_return else "void"
            call_line = f"System.out.println(sol.{func_name}({args}));" if has_return else f"sol.{func_name}({args});"
            
            return f"""
import java.util.*;
public class {class_name} {{
    public {ret_type} {func_name}({param_str}) {{
        {scanner_setup}
{code}
    }}
    public static void main(String[] args) {{
        {class_name} sol = new {class_name}();
        {call_line}
    }}
}}
"""
        elif language == "cpp":
            func_match = re.search(r'\w+\s+(\w+)\s*\(', code)
            func_name = func_match.group(1) if func_match else "solution"
            
            if not func_match:
                params = []
                if isinstance(input_data, dict):
                    for k, v in input_data.items():
                        params.append(f"{self._guess_cpp_type(v)} {k}")
                else:
                    params.append("int n")
                param_str = ", ".join(params)
                code = f"auto {func_name}({param_str}) {{\n{code}\n}}"

            args = self._format_args(input_data, "cpp")
            
            if "int main" in code:
                return code
                
            return f"""
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map>
#include <set>
using namespace std;

{code}

int main() {{
    cout << boolalpha << {func_name}({args}) << endl;
    return 0;
}}
"""
        return code

    def _guess_java_type(self, val: Any) -> str:
        if isinstance(val, bool): return "boolean"
        if isinstance(val, int): return "int"
        if isinstance(val, float): return "double"
        if isinstance(val, str): return "String"
        if isinstance(val, list):
            if not val: return "Object[]"
            return f"{self._guess_java_type(val[0])}[]"
        return "Object"

    def _guess_cpp_type(self, val: Any) -> str:
        if isinstance(val, bool): return "bool"
        if isinstance(val, int): return "int"
        if isinstance(val, float): return "double"
        if isinstance(val, str): return "string"
        if isinstance(val, list):
            if not val: return "vector<int>"
            return f"vector<{self._guess_cpp_type(val[0])}>"
        return "auto"

    def _format_args(self, input_data: Any, language: str) -> str:
        """Format input data as function arguments"""
        if not isinstance(input_data, dict):
            return self._format_value(input_data, language)
        return ", ".join([self._format_value(v, language) for v in input_data.values()])

    def _format_value(self, val: Any, language: str) -> str:
        """Format a single value based on language"""
        if isinstance(val, str):
            return f'"{val}"'
        if isinstance(val, bool):
            if language == "python": return str(val)
            if language == "java": return str(val).lower()
            if language == "cpp": return str(val).lower()
            return str(val).lower()
        if isinstance(val, (list, tuple)):
            if language == "python": return repr(val)
            if language == "javascript": return json.dumps(val)
            if language == "java":
                inner = ", ".join([self._format_value(v, language) for v in val])
                t = self._guess_java_type(val[0]) if val else "Object"
                return f"new {t}[]{{{inner}}}"
            if language == "cpp":
                inner = ", ".join([self._format_value(v, language) for v in val])
                return f"{{{inner}}}"
        return str(val)
    
    def _compare_output(self, output: str, expected: Any) -> bool:
        """Compare output with expected value"""
        try:
            # Normalize common formats
            output_clean = str(output).strip().lower()
            expected_clean = str(expected).strip().lower()
            
            if output_clean == expected_clean:
                return True
                
            # Try JSON comparison
            try:
                output_parsed = json.loads(output)
                expected_parsed = json.loads(json.dumps(expected))
                return output_parsed == expected_parsed
            except:
                pass
            
            return False
        except:
            return False

