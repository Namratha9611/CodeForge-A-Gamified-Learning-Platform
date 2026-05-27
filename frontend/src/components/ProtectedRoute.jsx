import { Navigate, useLocation } from 'react-router-dom';
import useGameStore from '../store/gameStore.js';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const assessmentTaken = localStorage.getItem('assessmentTaken') === 'true';
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If user hasn't taken assessment, redirect to assessment
    // Allow access to assessment page to prevent loop
    if (!assessmentTaken && location.pathname !== '/dashboard/skill-assessment') {
        return <Navigate to="/dashboard/skill-assessment" replace />;
    }

    return children;
};

export default ProtectedRoute;
