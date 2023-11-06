import {  useEffect, useState } from 'react'

type FormDataEvent = React.FormEvent<HTMLFormElement>

type clientes = {
  _id: string,
  name: string,
  email: string,
}
type modal = {
  _id: string,
  name: string,
  email: string,
  open: boolean,
}
function App() {

  const [ clientes, setClientes ] = useState<clientes[]>([])
  const [cargando, setCargando ] = useState<boolean>(false)
  const [ modal, setModal ] = useState<modal>({
    _id: '',
    name: '',
    email: '',
    open: false,
  })


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

  const eliminarCliente = async() => {
    setCargando(true)

    const id = modal._id

    try {
      const respuesta = await fetch(`/api/clientes/${modal._id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': "application/json"
        },
      })

      const data = await respuesta.json()


      console.log(clientes)

      const clientesActualizados = clientes.filter(cliente => {
        return cliente._id !== id

      })
      
      setClientes(clientesActualizados)
      
      alert(data.message)
      
    } catch (error) {
      alert(error)
    }finally{
      setCargando(false)
      setModal({
        _id: '',
        name: '',
        email: '',
        open: false,
      })

    }


  }

  const editarCliente = async(e: FormDataEvent) => {
    e.preventDefault()

    setCargando(true)
    
    try {

      let cliente = {
        name: modal.name,
        email: modal.email,
      }

      const respuesta = await fetch(`/api/clientes/${modal._id}`, {
        method: 'PUT', 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
      })

      const { data } = await respuesta.json()

      

      const clientesActualizados = clientes.map(clienteState => {
        if(clienteState._id === modal._id){
          
          return {
            ...clienteState,
            name: data.name,
            email: data.email,
          }
        }
        return clienteState
      })

      setClientes(clientesActualizados)
      
    } catch (error) {
      alert(error)
    }finally{
      setCargando(false)
      setModal({
        _id: '',
        name: '',
        email: '',
        open: false,
      })
    }
  }

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const respuesta = await fetch('/api/clientes')

      const { data } = await respuesta.json()

      setClientes(data)
      } catch (error) {
        console.log(error)
      }

    }

    obtenerClientes()
  },[])
  return (
    <>
    {
      modal.open && (
        <div
        className='bg-slate-950 opacity-90 fixed top-0 left-0 w-full h-screen z-0 flex justify-center p-10 '
        >
          <button
            className='fixed top-0 right-0 m-5'
            onClick={() => setModal({
              _id: '',
              name: '',
              email: '',
              open: false,
            })}
          >
            <svg
              className='w-10 h-10 text-white hover:text-blue-500'
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              >
              </path>
            </svg>

          </button>

          <div
            className='bg-slate-900 w-96 rounded-lg shadow-md p-10'
          >
            <h2 className='text-4xl font-bold mb-5 text-white'>Editar Cliente</h2>
            <form 
              className='flex flex-col items-center  min-h-screen text-white'
              onSubmit={editarCliente}>

              <input 
                className='bg-gray-800 border border-gray-600 p-2 rounded-lg shadow-md w-full'
                type="text" 
                placeholder='Nombre'
                value={modal.name}
                onChange={e => setModal({...modal, name: e.target.value})}
              />

              <input 
                className='bg-gray-800 border border-gray-600 p-2 rounded-lg shadow-md w-full mt-5'
                type="email" 
                placeholder='Email'
                value={modal.email}
                onChange={e => setModal({...modal, email: e.target.value})}
              />

              <button 
                className='bg-blue-500 hover:bg-blue-600 p-2 rounded-lg shadow-md w-full mt-5'
                type='submit'
              >
                Modificar cliente
              </button>
              <button
                className='bg-red-500 hover:bg-red-600 p-2 rounded-lg shadow-md w-full mt-5'
                type='button'
                onClick={eliminarCliente}
              >
                Eliminar cliente
              </button>

            </form>
          </div>


        </div>
      )
    }
    {
      cargando && (
        <div
      className='bg-slate-950 opacity-80 fixed top-0 left-0 w-full h-full z-0 flex items-center justify-center'
    >
      <div
        className='h-96 w-96 border-4 border-b-blue-700 border-blue-300 rounded-full animate-spin'
      >
      </div>

    </div>
      )
    }
    <main className='bg-gradient-to-r from-slate-900 to-slate-800 flex flex-col lg:flex-row'>

      <div className='flex flex-col p-5 text-white w-full lg:w-1/3'>
        <h1 className='text-4xl font-bold'>Clientes</h1>
        {
          clientes && clientes.length === 0 ? (
            <p className='mt-5'>No hay clientes</p>
          ) : (
            
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
              clientes && clientes.length > 0 && clientes.map((cliente: any) => (
                <tr key={cliente._id}
                  className='text-white'
                  onClick={() => setModal({
                    _id: cliente._id,
                    name: cliente.name,
                    email: cliente.email,
                    open: true,
                  })}
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
          )
        }
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
