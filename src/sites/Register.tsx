const Register = () => {

function handleSubmit(event){
    event.preventDefault()
    const data = event.currentTarget
    const fd = new FormData(data)
    const values = Object.fromEntries(fd.entries())


}
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center ">
        <div className="flex flex-col border rounded-2xl p-10 md:p-12">
        <h2>Register site</h2>
        <h5 className="mb-6">Here you can register if this is your first visit on this website</h5>
        <form id="registerForm" onSubmit={handleSubmit} className="grid grid-cols-[130px_minmax(0,1fr)] gap-x-3 gap-y-3 items-center">
            <label className="text-sm" htmlFor="name">Name</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="name" name="name" />

            <label className="text-sm" htmlFor="lastName">Lastname</label>
            <input className="w-full border  bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="lastName" name="lastName" />

            <label className="text-sm" htmlFor="username">Username</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="username" name="username" />

            <label className="text-sm" htmlFor="password">Password</label>
            <input className="w-full border  bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="password" id="password" name="password" />

            <label className="text-sm leading-tight" htmlFor="passwordConfirm">Password<br />confirmation</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="password" id="passwordConfirm" name="passwordConfirm" />
            <button className="text-blue-400 hover:text-blue-600">Show Password </button>
        </form>
        <button form="registerForm" type="submit" className="mt-2 bg-blue-300 dark:bg-blue-600 rounded-2xl border">Submit </button>

        </div>
    </div>
  )
}

export default Register