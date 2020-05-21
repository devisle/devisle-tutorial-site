/**
 * Binds a page component within itself providing the layout features
 * to maintain consistency in all pages
 * 
 * @param {React.ReactNode} children
 * @author rakeshshubhu
 */
const Layout: React.FC = ({children}) => {
    return (
        <>          
            <div className="container">
                {children}
            </div>
        </>
    )
}

export default Layout;
