import React from 'react';
import NotFoundPage from '../../pages/customer/notFound/NotFound.jsx';

const AdminRoute = ({isAdmin , children}) => {
    if (isAdmin) {
        return  <NotFoundPage/>;
    } else {
        return <>{children}</>;

    }

};

export default AdminRoute;
