import { signUpAction } from "../actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage(){
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 ">
            <h1 className="text-2xl font-bold  ">SignUp</h1>
            <form action={signUpAction} className="flex flex-col gap-3 w-64 ">
                <Input type="text" name="name" placeholder="Name" required ></Input>
                <Input type="email" name="email" placeholder="Email" required ></Input>
                <Input type="password" name="password" placeholder="Password" required ></Input>
                <Button type="submit" >SignUp</Button>
            </form>
        </div>
    )

}