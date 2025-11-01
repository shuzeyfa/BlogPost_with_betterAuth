import { signInAction } from "../actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage(){
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 ">
            <h1 className="text-2xl font-bold  ">Sign In</h1>
            <form action={signInAction} className="flex flex-col gap-3 w-64 ">
                <Input type="email" name="email" placeholder="Email" required ></Input>
                <Input type="password" name="password" placeholder="Password" required ></Input>
                <Button type="submit" >SignIn</Button>
            </form>
        </div>
    )

}