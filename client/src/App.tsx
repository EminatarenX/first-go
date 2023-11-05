import {  useEffect, useState } from 'react'


function App() {

  const [ clientes, setClientes ] = useState([])


  useEffect(() => {
    const obtenerClientes = async () => {
      const respuesta = await fetch('/api/clientes')

      const { data } = await respuesta.json()

      setClientes(data)
    }

    obtenerClientes()
  },[])
  return (
    <main className='bg-gradient-to-r from-slate-900 to-slate-800'>

      <div className='flex flex-col items-center justify-center min-h-screen text-white w-1/3'>
        <h1 className='text-4xl font-bold'>Clientes</h1>
        <ul>
          {
            clientes.map((cliente: any) => (
              <li key={cliente.id}>
                {cliente.name}
              </li>
            ))
          }
        </ul>
      </div>
      
    </main>
  )
}

export default App
