// ========================================
// OSS MANAGEMENT SYSTEM
// CRUD OSS
// ========================================


let ossData = [];

let editOSS_ID = null;






// ========================================
// LOAD OSS
// ========================================


async function loadOSS(){


    try{


        showLoadingOSS(true);



        const data = await getOSS();



        ossData = data || [];



        tampilkanOSS(ossData);



        updateTotalOSS();



    }


    catch(error){



        console.error(

            "LOAD OSS ERROR",

            error

        );



        let table =

        document.getElementById(

            "ossData"

        );



        if(table){



            table.innerHTML = `

            <tr>

            <td colspan="5">

            Gagal mengambil data OSS

            </td>

            </tr>

            `;



        }



    }


    finally{


        showLoadingOSS(false);


    }



}









// ========================================
// TAMPIL TABLE OSS
// ========================================


function tampilkanOSS(data){



    let html="";






    if(!data || data.length===0){



        html = `



        <tr>


        <td colspan="5"
        class="empty-data">


        Belum ada data OSS


        </td>


        </tr>


        `;



    }






    else{



        data.forEach((item,index)=>{





            html += `



            <tr>



            <td>

            ${item.reference_code || "-"}

            </td>





            <td>

            ${item.cust_id || "-"}

            </td>





            <td>

            ${item.customer || "-"}

            </td>





            <td>

            ${item.city || "-"}

            </td>





            <td>



            <button

            class="btn edit"

            onclick="editOSS(${index})">


            ✏ Edit


            </button>





            <button

            class="btn delete"

            onclick="deleteOSS(${index})">


            🗑 Hapus


            </button>



            </td>



            </tr>



            `;



        });



    }







    let table =

    document.getElementById(

        "ossData"

    );







    if(table){


        table.innerHTML = html;



    }




}









// ========================================
// SEARCH OSS
// ========================================


function searchOSS(){



    let keyword =


    document

    .getElementById(

        "searchOSS"

    )

    .value

    .toLowerCase();







    let result =

    ossData.filter(item=>{





        return (





        String(item.reference_code)

        .toLowerCase()

        .includes(keyword)





        ||





        String(item.customer)

        .toLowerCase()

        .includes(keyword)





        ||





        String(item.city)

        .toLowerCase()

        .includes(keyword)





        );





    });








    tampilkanOSS(result);



}
// ========================================
// SAVE OSS
// ========================================


async function saveOSS(){



    let data = {


        reference_code:


        document

        .getElementById(

            "referenceCode"

        )

        .value

        .trim(),





        cust_id:


        document

        .getElementById(

            "custID"

        )

        .value

        .trim(),





        customer:


        document

        .getElementById(

            "customer"

        )

        .value

        .trim(),





        city:


        document

        .getElementById(

            "city"

        )

        .value

        .trim()



    };








    if(


        !data.reference_code

    ){


        alert(

            "Reference Code wajib diisi"

        );


        return;


    }









    try{



        if(editOSS_ID){

    await updateOSSAPI({

        id:
        editOSS_ID,

        reference_code:
        data.reference_code,

        cust_id:
        data.cust_id,

        customer:
        data.customer,

        city:
        data.city

    });

}




        else{



            await addOSSAPI(

                data

            );



        }







        closeOSS();



        resetOSSForm();



        await loadOSS();





    }



    catch(error){



        console.error(

            error

        );



        alert(

            "Gagal menyimpan OSS"

        );



    }




}









// ========================================
// EDIT OSS
// ========================================


function editOSS(index){



    let data =

    ossData[index];







    editOSS_ID =
data.id;







    document

    .getElementById(

        "referenceCode"

    )

    .value =

    data.reference_code || "";








    document

    .getElementById(

        "custID"

    )

    .value =

    data.cust_id || "";








    document

    .getElementById(

        "customer"

    )

    .value =

    data.customer || "";








    document

    .getElementById(

        "city"

    )

    .value =

    data.city || "";








    let title =

    document

    .getElementById(

        "ossModalTitle"

    );





    if(title){



        title.innerText =

        "Edit Data OSS";



    }







    openAddOSS();



}









// ========================================
// DELETE OSS
// ========================================


async function deleteOSS(index){



    let data =

    ossData[index];







    let confirmDelete =

    confirm(

        "Hapus data OSS ini?"

    );







    if(!confirmDelete){



        return;



    }







    try{



        await deleteOSSAPI(
    data.id
);





        await loadOSS();





    }



    catch(error){



        console.error(

            error

        );




        alert(

            "Gagal menghapus OSS"

        );



    }



}









// ========================================
// RESET FORM OSS
// ========================================


function resetOSSForm(){



    editOSS_ID=null;







    let fields=[



        "referenceCode",

        "custID",

        "customer",

        "city"



    ];








    fields.forEach(id=>{



        let el =

        document

        .getElementById(id);





        if(el){



            el.value="";



        }



    });








    let title =

    document

    .getElementById(

        "ossModalTitle"

    );





    if(title){



        title.innerText =

        "Tambah Data OSS";



    }



}
// ========================================
// OPEN MODAL TAMBAH OSS
// ========================================


function openAddOSS(){


    let modal =

    document

    .getElementById(

        "modalOSS"

    );





    if(modal){



        modal.style.display="flex";



    }



}









// ========================================
// CLOSE MODAL OSS
// ========================================


function closeOSS(){



    let modal =

    document

    .getElementById(

        "modalOSS"

    );






    if(modal){



        modal.style.display="none";



    }



}









// ========================================
// OPEN UPLOAD OSS
// ========================================


function openUploadOSS(){



    let modal =

    document

    .getElementById(

        "uploadOSSModal"

    );





    if(modal){



        modal.style.display="flex";



    }




}









// ========================================
// CLOSE UPLOAD OSS
// ========================================


function closeUploadOSS(){



    let modal =

    document

    .getElementById(

        "uploadOSSModal"

    );





    if(modal){



        modal.style.display="none";



    }





}









// ========================================
// UPDATE TOTAL OSS
// ========================================


function updateTotalOSS(){



    let total =

    document

    .getElementById(

        "totalOSS"

    );






    if(total){



        total.innerText =

        ossData.length +

        " Data";



    }




}









// ========================================
// LOADING OSS
// ========================================


function showLoadingOSS(status){



    let el =

    document

    .getElementById(

        "loadingOSS"

    );





    if(!el){



        return;



    }








    if(status){



        el.innerHTML =

        "⏳ Loading...";



    }



    else{



        el.innerHTML =

        "🟢 Ready";



    }




}









// ========================================
// REALTIME REFRESH OSS
// ========================================


function refreshOSS(){



    loadOSS();



}









// ========================================
// START OSS
// ========================================


document.addEventListener(


"DOMContentLoaded",


()=>{



    loadOSS();



});

// ========================================
// EXCEL UPLOAD CONNECTOR OSS
// ========================================


function uploadOSS(){


    if(typeof uploadOSSExcel === "function"){


        return uploadOSSExcel();


    }


    else{


        console.error(

            "uploadOSSExcel tidak ditemukan"

        );


        alert(

            "Module Excel OSS belum aktif"

        );


    }


}
