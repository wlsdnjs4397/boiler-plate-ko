import React ,{useEffect} from 'react'
import axios from "axios";

function LandingPage() {
    useEffect(()=>{
        axios.get('http://localhost:4000/api/hello')
            .then(response=> console.log(response.data))
    },[])

    return (
        <div>
            LandingPage 렌딩페이지
        </div>
    )
}

export default LandingPage