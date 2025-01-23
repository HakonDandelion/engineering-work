import axios from "axios"
import { useState } from "react"

export default function SignupForm(){
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    async function handleSubmit(event){
        event.preventDefault()

        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData)

        try{
            const res = await axios.post("/api/user", data)
            setSuccess(res.data.success)
        }catch(error){
            if(error.response?.data?.error){
                return setError(error.response.data.error)
            }
            return setError("Nie wiem co to za błąd")
        }
    }

    if(success){
        return <p className="text-green-500">{success}</p>
    }

    return(
        <div className="max-w-sm">
          <form onSubmit={handleSubmit}>
              <fieldset className="mt-4 w-full inline-flex bg-white p-1.5 rounded-lg
              disabled:opacity-75 outline-3 focus-within:outline focus-within:outline-blue-600"
              >
                <input 
                name="email"
                type="text"
                className="w-full focus:outline-none p-2 rounded-md" 
                />
                <button className="text-white font-bold whitespace-nowrap px-5 rounded-md
                bg-blue-600 enabled:hover:bg-blue-700 focus:outline-blue-800"
                >
                  Zapisz się
                </button>
              </fieldset>
            </form>
            {error && <p className="text-red-600">{error}</p>}
          </div>
    )
}