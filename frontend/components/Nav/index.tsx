import Link from "next/link";
import { StyledNav } from "./nav.styles";

const Nav: React.FC = () => {
    return (
        <StyledNav role="navigation">
            <div aria-label="site logo">
                <h1 role="heading">Tutorials</h1>
                <h2 role="sub-heading">&nbsp;by DevIsle</h2>
            </div>
            <div>
                <h2>
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </h2>
            </div>
        </StyledNav>
    )
}
export default Nav;