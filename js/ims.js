// ========================================
// IMS MANAGEMENT SYSTEM
// CRUD IMS
// ========================================


let imsData = [];

let editIMS_ID = null;









// ========================================
// LOAD IMS
// ========================================


async function loadIMS(){



    try{



        showLoadingIMS(true);





        const data = await getIMS();





        imsData = data || [];





        tampilkanIMS(imsData);





        updateTotalIMS();





        generateMonthFilterIMS();





        updateIMSInfo();





    }



    catch(error){



        console.error(

            "LOAD IMS ERROR",

            error

        );






        let table =

        document.getElementById(

            "imsData"

        );






        if(table){



            table.innerHTML = `



            <tr>


            <td colspan="7">


            Gagal mengambil data IMS


            </td>


            </tr>



            `;



        }




    }



    finally{



        showLoadingIMS(false);



    }



}











// ========================================
// TAMPIL TABLE IMS
// ========================================


function tampilkanIMS(data){



    let html="";






    if(!data || data.length===0){



        html = `



        <tr>


        <td colspan="7"
        class="empty-data">


        Belum ada data IMS


        </td>


        </tr>



        `;



    }







    else{



        data.forEach((item,index)=>{





            html += `



            <tr>





            <td>

            ${item.wo || "-"}

            </td>







            <td>

            ${item.reference_code || "-"}

            </td>







            <td>

            ${item.quotation || "-"}

            </td>







            <td>

            ${item.job_name || "-"}

            </td>







            <td>

            ${statusBadge(item.status)}

            </td>







            <td>

            ${item.bulan || "-"}

            </td>







            <td>






            <button

            class="btn edit"

            onclick="editIMS(${index})">


            ✏ Edit


            </button>







            <button

            class="btn delete"

            onclick="deleteIMS(${index})">


            🗑 Hapus


            </button>







            </td>






            </tr>



            `;




        });



    }






    let table =

    document.getElementById(

        "imsData"

    );





    if(table){



        table.innerHTML = html;



    }



}












// ========================================
// STATUS BADGE
// ========================================


function statusBadge(status){



    let cls="";






    if(



        status==="Approved" ||

        status==="Booked" ||

        status==="Closed" ||

        status==="Ready to Invoice"



    ){



        cls="status-sudah";



    }





    else if(status==="Revisi"){



        cls="status-revisi";



    }





    else{



        cls="status-progress";



    }






    return `



    <span class="badge ${cls}">


    ${status || "Progress"}


    </span>



    `;



}











// ========================================
// SEARCH IMS
// ========================================


function searchIMS(){



    let keyword =


    document

    .getElementById(

        "searchIMS"

    )

    .value

    .toLowerCase();







    let result =

    imsData.filter(item=>{






        return (





        String(item.wo)

        .toLowerCase()

        .includes(keyword)







        ||







        String(item.reference_code)

        .toLowerCase()

        .includes(keyword)








        ||








        String(item.job_name)

        .toLowerCase()

        .includes(keyword)






        );




    });








    tampilkanIMS(result);



}

// ========================================
// SAVE IMS
// ========================================


async function saveIMS(){



    let data = {



        wo:


        document

        .getElementById(

            "wo"

        )

        .value

        .trim(),







        reference_code:


        document

        .getElementById(

            "imsReferenceCode"

        )

        .value

        .trim(),







        quotation:


        document

        .getElementById(

            "quotation"

        )

        .value

        .trim(),







        job_name:


        document

        .getElementById(

            "jobName"

        )

        .value

        .trim(),







        status:


        document

        .getElementById(

            "imsStatus"

        )

        .value,







        bulan:


        document

        .getElementById(

            "imsMonth"

        )

        .value

        .trim()



    };









    if(



        !data.wo ||

        !data.reference_code



    ){



        alert(

            "WO dan Reference Code wajib diisi"

        );



        return;



    }









    try{





        if(editIMS_ID){





            await updateIMSAPI(


                {


                    wo:data.wo,


                    reference_code:data.reference_code,


                    quotation:data.quotation,


                    job_name:data.job_name,


                    status:data.status,


                    bulan:data.bulan



                }


            );





        }





        else{





            await addIMSAPI(



                data



            );





        }









        closeIMS();





        resetIMSForm();





        await loadIMS();







    }



    catch(error){





        console.error(

            error

        );





        alert(

            "Gagal menyimpan data IMS"

        );





    }





}











// ========================================
// EDIT IMS
// ========================================


function editIMS(index){



    let data =

    imsData[index];






    editIMS_ID=data.id







    document

    .getElementById(

        "wo"

    )

    .value =

    data.wo || "";







    document

    .getElementById(

        "imsReferenceCode"

    )

    .value =

    data.reference_code || "";







    document

    .getElementById(

        "quotation"

    )

    .value =

    data.quotation || "";







    document

    .getElementById(

        "jobName"

    )

    .value =

    data.job_name || "";







    document

    .getElementById(

        "imsStatus"

    )

    .value =

    data.status || "Progress";







    document

    .getElementById(

        "imsMonth"

    )

    .value =

    data.bulan || "";








    let title =

    document

    .getElementById(

        "imsModalTitle"

    );





    if(title){



        title.innerText =

        "Edit Data IMS";



    }








    openAddIMS();





}











// ========================================
// DELETE IMS
// ========================================


async function deleteIMS(index){



    let data =

    imsData[index];







    let confirmDelete =

    confirm(

        "Hapus data IMS ini?"

    );






    if(!confirmDelete){



        return;



    }









    try{





        await deleteIMSAPI(data.id)

        );







        await loadIMS();







    }



    catch(error){





        console.error(

            error

        );






        alert(

            "Gagal menghapus data IMS"

        );





    }





}











// ========================================
// RESET FORM IMS
// ========================================


function resetIMSForm(){



    editIMS_ID=null;






    let fields=[



        "wo",

        "imsReferenceCode",

        "quotation",

        "jobName",

        "imsMonth"



    ];








    fields.forEach(id=>{



        let el =

        document

        .getElementById(id);






        if(el){



            el.value="";



        }




    });








    let status =

    document

    .getElementById(

        "imsStatus"

    );





    if(status){



        status.value="Progress";



    }









    let title =

    document

    .getElementById(

        "imsModalTitle"

    );






    if(title){



        title.innerText =

        "Tambah Data IMS";



    }





}
// ========================================
// FILTER IMS
// ========================================


function filterIMS(){



    let status =


    document

    .getElementById(

        "statusFilter"

    )

    .value;







    let bulan =


    document

    .getElementById(

        "monthFilterIMS"

    )

    .value;









    let result =

    imsData.filter(item=>{






        let cocokStatus =



        status === ""

        ||

        item.status === status;







        let cocokBulan =



        bulan === ""

        ||

        item.bulan === bulan;







        return (

            cocokStatus

            &&

            cocokBulan

        );





    });








    tampilkanIMS(result);



}











// ========================================
// GENERATE FILTER BULAN
// ========================================


function generateMonthFilterIMS(){



    let select =

    document

    .getElementById(

        "monthFilterIMS"

    );






    if(!select){



        return;



    }








    let bulanList = [



        ...new Set(



            imsData.map(

                item=>item.bulan

            )



        )



    ];








    let html = `



    <option value="">


        Semua Bulan


    </option>



    `;









    bulanList.forEach(bulan=>{





        if(bulan){





            html += `



            <option value="${bulan}">


                ${bulan}


            </option>



            `;





        }




    });








    select.innerHTML = html;




}











// ========================================
// UPDATE TOTAL IMS
// ========================================


function updateTotalIMS(){



    let total =


    document

    .getElementById(

        "totalIMS"

    );







    if(total){



        total.innerText =

        imsData.length +

        " Data";



    }









    let revision =


    document

    .getElementById(

        "revisionIMS"

    );








    if(revision){





        let jumlah =


        imsData.filter(item=>



            item.status === "Revisi"



        ).length;







        revision.innerText =

        jumlah;



    }









    let bulan =


    document

    .getElementById(

        "monthIMS"

    );








    if(bulan){



        let now =


        new Date()

        .toLocaleString(

            "id-ID",

            {

                month:"long"

            }

        );








        let totalBulan =


        imsData.filter(item=>


            String(item.bulan)

            .toLowerCase()

            ===

            now.toLowerCase()



        ).length;








        bulan.innerText =

        totalBulan;



    }



}












// ========================================
// UPDATE INFO
// ========================================


function updateIMSInfo(){



    let el =


    document

    .getElementById(

        "lastUpdateIMS"

    );








    if(el){



        el.innerText =


        new Date()

        .toLocaleString(

            "id-ID"

        );



    }




}











// ========================================
// MODAL IMS
// ========================================


function openAddIMS(){



    let modal =


    document

    .getElementById(

        "modalIMS"

    );







    if(modal){



        modal.style.display="flex";



    }




}









function closeIMS(){



    let modal =


    document

    .getElementById(

        "modalIMS"

    );







    if(modal){



        modal.style.display="none";



    }




}









// ========================================
// UPLOAD MODAL IMS
// ========================================


function openUploadIMS(){



    let modal =


    document

    .getElementById(

        "uploadIMSModal"

    );







    if(modal){



        modal.style.display="flex";



    }



}









function closeUploadIMS(){



    let modal =


    document

    .getElementById(

        "uploadIMSModal"

    );







    if(modal){



        modal.style.display="none";



    }




}











// ========================================
// LOADING IMS
// ========================================


function showLoadingIMS(status){



    let el =


    document

    .getElementById(

        "loadingIMS"

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
// REALTIME REFRESH
// ========================================


function refreshIMS(){



    loadIMS();



}












// ========================================
// START IMS
// ========================================


document.addEventListener(


"DOMContentLoaded",


()=>{



    loadIMS();



});
