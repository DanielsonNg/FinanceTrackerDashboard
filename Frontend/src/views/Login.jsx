import { Link } from "react-router-dom";

export default function Login(){
    return(
        <>
        <p>Login Page</p>
        <Link to={'/'}><button>Home Page</button></Link>

        </>
    )
}