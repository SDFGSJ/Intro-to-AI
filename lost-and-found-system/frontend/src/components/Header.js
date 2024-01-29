import logo from '../assets/images/NTHU_logo.png'

export default function Header({ setShowAddItem }) {

    return (
        <nav className="nav-bar">
        <p><a href="/"><img src={logo} alt="logo" height="50" /></a></p>
        <ul>
            <li><a href="/">Home</a></li>
            <li><div onClick={(e) => setShowAddItem(e, true)}>Add Item</div></li>
        </ul>
        </nav>
    )
}
