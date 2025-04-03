import { signIn } from '@/auth'

const LoginPage = () => {
    return (
        <div onClick={async () => {
            "use server"
            await signIn("google")
        }}>SignIn</div>
    )
}

export default LoginPage