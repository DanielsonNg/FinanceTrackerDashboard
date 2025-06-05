import { Link } from "react-router-dom";

export default function Home(){
    return(
        <>
        <h1>Home Page</h1>
        <Link to={'/login'}><button>Login Page</button></Link>
        <div className="text-primary bg-secondary">Test</div>
        </>
    )
}