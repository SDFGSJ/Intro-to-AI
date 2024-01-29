import Header from './Header'
import Home from '../pages/Home'
import { useState } from 'react'
import AddItem from '../pages/AddItem'
// import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

export default function Router() {
    const [showAddItem, setShowAddItem] = useState(false)

    const controlShowAddItem = (e, toShow) => {
        if(e !== null)
        {
            console.log(e)
            e.preventDefault()
        }

        setShowAddItem(toShow)
    }

    return (
        <>
            {showAddItem && <AddItem setShowAddItem={controlShowAddItem}></AddItem>}
            <Header setShowAddItem={controlShowAddItem}/>
            <div className="content"><Home /></div>
        </>
    )
}