import { db } from "@/fire";
import { collection, getDocs, query,where, setDoc, addDoc, getDoc, doc } from "firebase/firestore";

const testdoc = collection(db, 'testing');

export const getdata = async ()=>{

    const docsnap = await getDocs(testdoc);

    docsnap.forEach(doc => {
        console.log(doc.id, doc.data());
    })

}

export const getinfo = async (docid)=>{
    const docref = doc(db, 'testing', docid);
    const docsnap = await getDoc(docref);   
    if(docsnap.exists()){
        return docsnap.data()
    }
    else{
        return null
    }
}

export const checkuser = async (user)=>{
    const q = query(testdoc, where('email', '==', user.email))
    const querysnap = await getDocs(q);
    let data = {};

    //console.log(querysnap)
    if(querysnap.empty){
        const docref = await addDoc(testdoc, {
            ...user,
        })
    
        data = {
             id: docref.id
        }
    }
    else{
        querysnap.forEach((doc) => {
            data = {  id:doc.id  }
        })
    }

    return data;
}