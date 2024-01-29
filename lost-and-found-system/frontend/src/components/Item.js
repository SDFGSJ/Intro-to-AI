
export default function Item({description, picture, dateLost, locationFound, status, finder}) {

    return (
        <div className="item">
            <img className="item-picture" src={picture}/>
            <p className="item-dateLost">Lost date: {dateLost}</p>
            <p className="item-locationFound">Location Found: {locationFound}</p>
            <p className="item-status">Status: {status}</p>
            {
                finder.name == "Anonymous"
                ? <p className="item-finderName">Finder: Anonymous</p>
                : <div>
                    <p className="item-finderName">Finder: {finder.name}</p>
                    <p className="item-finderContact">Contact: {finder.contact}</p>
                </div>
            }
            <p className="item-description">Description: {description}</p>
        </div>
    )
}