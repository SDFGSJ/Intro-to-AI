import PacmanLoader from "react-spinners/PacmanLoader";

export default function Loading({ cancelCallback, info , pending}){
    return (
        <div className="loading">
            <div className="half-transparent-background">
                <div className="background">
                    <p >{info}</p>
                    {
                        pending
                        ?   <PacmanLoader className="loader" color="#36d7b7"/>
                        : null
                    }
                    {
                        info === "Searching..." || pending === false
                        ?   <button onClick={(e) => cancelCallback(null, false)}>Cancel</button>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}