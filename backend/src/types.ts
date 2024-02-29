const z=require("zod")



export const userSignup=z.object({
    username:z.coerce.string().min(5).max(20).refine((username:string) => !/\s/.test(username), {
        message: "Username should not contain whitespace",
    }),
    email:z.string().email(),
    password:z.coerce.string().min(8)
})

export const userSignin=z.object({
    username:z.string().min(8).max(20),
    password:z.coerce.string().min(8)
})

