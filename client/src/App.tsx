import {  useEffect, useState } from 'react'

type FormDataEvent = React.FormEvent<HTMLFormElement>

type clientes = {
  id: string,
  name: string,
  email: string,
}
function App() {

  const [ clientes, setClientes ] = useState<clientes[]>([])
  const [cargando, setCargando ] = useState<boolean>(false)

  const [formCliente, setFormCliente] = useState({
    name: '',
    email: '',
  })

  const crearCliente = async (e: FormDataEvent) => {
    e.preventDefault()
    setCargando(true)

    const cliente = {
      name: formCliente.name,
      email: formCliente.email,
    }

    try {

      const respuesta = await fetch('/api/clientes', {
        method: 'POST', 
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(cliente)
  
      })
  
      const { data } = await respuesta.json()
  
      setClientes([
        ...clientes,
        data
      ])
  
      setFormCliente({
        name: '',
        email: '',
      })

    } catch (error) {
      alert(error)
    }finally{
      setCargando(false)
    }



    
  }

  useEffect(() => {
    const obtenerClientes = async () => {
      const respuesta = await fetch('/api/clientes')

      const { data } = await respuesta.json()

      setClientes(data)
    }

    obtenerClientes()
  },[])
  return (
    <>
    {
      cargando && (
        <div
      className='bg-slate-950 opacity-80 fixed top-0 left-0 w-full h-full z-0 flex items-center justify-center'
    >
      <div
        className='h-96 w-96 border border-b-blue-600 border-blue-300 rounded-full animate-spin'
      >
      </div>

    </div>
      )
    }
    <main className='bg-gradient-to-r from-slate-900 to-slate-800 flex flex-col lg:flex-row'>

      <div className='flex flex-col p-5 text-white w-full lg:w-1/3'>
        <h1 className='text-4xl font-bold'>Clientes</h1>
        <table 
          className='table-auto w-full mt-5'
        >
          <thead
            className='bg-blue-500 text-left'
          >
            <tr
              className='text-white'
            >
              <th
                className='px-4 py-2'
              >Nombre</th>
              <th
                className='px-4 py-2'
              >Email</th>
            </tr>
          </thead>
          <tbody
            className='divide-y divide-blue-500'
          >
          {
            clientes.map((cliente: any) => (
              <tr key={cliente.id}
                className='text-white'
              >
                <td
                  className='px-4 py-2'
                >{cliente.name}</td>
                <td
                  className='px-4 py-2'
                >{cliente.email}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>

      <div className='w-full lg:w-2/3 p-10 '>
          <form 
            className='flex flex-col items-center  min-h-screen text-white'
            onSubmit={crearCliente}>

            <h2 className='text-4xl font-bold mb-5'>Crear Cliente</h2>

            <input 
              className='bg-gray-800 border border-gray-600 p-2 rounded-lg shadow-md w-full'
              type="text" 
              placeholder='Nombre'
              value={formCliente.name}
              onChange={e => setFormCliente({...formCliente, name: e.target.value})}
            />

            <input 
              className='bg-gray-800 border border-gray-600 p-2 rounded-lg shadow-md w-full mt-5'
              type="email" 
              placeholder='Email'
              value={formCliente.email}
              onChange={e => setFormCliente({...formCliente, email: e.target.value})}
            />

            <button 
              className='bg-blue-500 hover:bg-blue-600 p-2 rounded-lg shadow-md w-full mt-5'
              type='submit'
            >
              Crear Cliente
            </button>

          </form>

      </div>
      
    </main>
    </>
  )
}

export default App
