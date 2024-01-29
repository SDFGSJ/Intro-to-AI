
export default function Description({ description, setFunction }) {

    const changeDescription = (e) =>{
        let modifiedDescription = e.target.value

        setFunction(modifiedDescription)
    }

    return(
        <>
            {/* <label className="child-description-label" htmlFor="description">{idx}:</label> */}
            <input className="child-description" type="text" name="description" value={description} onChange={(e) => changeDescription(e)}></input>
        </>
    )
}