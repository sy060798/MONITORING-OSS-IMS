// ========================================
// EXCEL SYSTEM
// OSS IMS MONITORING
// ========================================


// membutuhkan library:
// XLSX.js
// https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js






// ========================================
// READ EXCEL FILE
// ========================================


function readExcel(file){



    return new Promise((resolve,reject)=>{





        let reader = new FileReader();







        reader.onload = function(e){





            try{





                let workbook = XLSX.read(


                    e.target.result,


                    {


                        type:"binary"


                    }



                );








                let sheetName =

                workbook.SheetNames[0];








                let sheet =

                workbook.Sheets[sheetName];








                let data =


                XLSX.utils.sheet_to_json(


                    sheet,


                    {


                        defval:""


                    }



                );








                resolve(data);





            }





            catch(error){



                reject(error);



            }





        };









        reader.onerror = function(error){



            reject(error);



        };








        reader.readAsBinaryString(file);




    });



}









// ========================================
// CLEAN HEADER
// ========================================


function cleanExcelHeader(text){


    return String(text)

    .trim()

    .toLowerCase()

    .replace(/_/g," ")

    .replace(/\s+/g," ");


}






// ========================================
// VALIDATE HEADER
// ========================================


function validateExcelHeader(data,required){



    if(

        !data ||

        data.length===0

    ){



        return false;



    }









    let header =


    Object.keys(data[0])

    .map(item=>

        cleanExcelHeader(item)

    );









    return required.every(item=>



        header.includes(

            cleanExcelHeader(item)

        )



    );



}









// ========================================
// IMPORT OSS EXCEL
// ========================================


async function uploadOSSExcel(){



    let file =


    document

    .getElementById(

        "excelOSS"

    )

    .files[0];







    if(!file){



        alert(

            "Pilih file OSS"

        );



        return;



    }








    try{





        let excel =


        await readExcel(file);








        let valid =


        validateExcelHeader(



            excel,


            [


                "Reference Code",


                "Cust ID",


                "Customer",


                "City"



            ]



        );








        if(!valid){



            alert(

            "Format Excel OSS salah"

            );



            return;



        }








        let data=[];








        excel.forEach(row=>{





            data.push({



                reference_code:

                row["Reference Code"] || "",





                cust_id:

                row["Cust ID"] || "",





                customer:

                row["Customer"] || "",





                city:

                row["City"] || ""



            });





        });









        let result =


        await bulkAddOSSAPI(data);








        if(result.success){



            alert(

            "Upload OSS berhasil"

            );



            loadOSS();



        }







    }



    catch(error){



        console.error(error);



        alert(

        "Upload OSS gagal"

        );



    }





}









// ========================================
// IMPORT IMS EXCEL
// ========================================


async function uploadIMSExcel(){



    let file =


    document

    .getElementById(

        "excelIMS"

    )

    .files[0];








    if(!file){



        alert(

        "Pilih file IMS"

        );



        return;



    }








    try{





        let excel =


        await readExcel(file);








        let valid =


        validateExcelHeader(



            excel,


            [


                "WO",


                "Reference Code",


                "Quotation",


                "Job Name",


                "Status",


                "Bulan"



            ]



        );









        if(!valid){



            alert(

            "Format Excel IMS salah"

            );



            return;



        }








        let data=[];








        excel.forEach(row=>{





            data.push({




                wo:

                row["WO"] || "",





                reference_code:

                row["Reference Code"] || "",





                quotation:

                row["Quotation"] || "",





                job_name:

                row["Job Name"] || "",





                status:

                row["Status"] || "Progress",





                bulan:

                row["Bulan"] || ""



            });





        });








        let result =


        await bulkAddIMSAPI(data);








        if(result.success){



            alert(

            "Upload IMS berhasil"

            );



            loadIMS();



        }




    }





    catch(error){



        console.error(error);



        alert(

        "Upload IMS gagal"

        );



    }



}

// ========================================
// EXPORT OSS
// ========================================


function exportOSSExcel(){



    if(

        !window.ossData ||

        ossData.length===0

    ){



        alert(

        "Data OSS kosong"

        );



        return;



    }









    let ws =


    XLSX.utils.json_to_sheet(


        ossData.map(item=>({



            "Reference Code":

            item.reference_code,



            "Cust ID":

            item.cust_id,



            "Customer":

            item.customer,



            "City":

            item.city



        }))



    );









    let wb =


    XLSX.utils.book_new();








    XLSX.utils.book_append_sheet(


        wb,


        ws,


        "OSS"



    );









    XLSX.writeFile(


        wb,


        "Data_OSS.xlsx"



    );



}











// ========================================
// EXPORT IMS
// ========================================


function exportIMSExcel(){



    if(

        !window.imsData ||

        imsData.length===0

    ){



        alert(

        "Data IMS kosong"

        );



        return;



    }









    let ws =


    XLSX.utils.json_to_sheet(


        imsData.map(item=>({




            "WO":

            item.wo,




            "Reference Code":

            item.reference_code,




            "Quotation":

            item.quotation,




            "Job Name":

            item.job_name,




            "Status":

            item.status,




            "Bulan":

            item.bulan




        }))



    );









    let wb =


    XLSX.utils.book_new();









    XLSX.utils.book_append_sheet(


        wb,


        ws,


        "IMS"



    );









    XLSX.writeFile(


        wb,


        "Data_IMS.xlsx"



    );



}











// ========================================
// EXPORT MASTER
// ========================================


function exportMasterExcel(){



    if(

        !window.masterData ||

        masterData.length===0

    ){



        alert(

        "Data Master kosong"

        );



        return;



    }









    let ws =


    XLSX.utils.json_to_sheet(


        masterData.map(item=>({




            "WO":

            item.wo,





            "Reference Code":

            item.reference_code,





            "Customer":

            item.customer,





            "City":

            item.city,





            "Bulan":

            item.bulan,





            "Job Name":

            item.job_name,





            "Status":

            item.status,





            "Note":

            item.note





        }))



    );









    let wb =


    XLSX.utils.book_new();








    XLSX.utils.book_append_sheet(


        wb,


        ws,


        "MASTER"



    );









    XLSX.writeFile(


        wb,


        "Master_Monitoring.xlsx"



    );



}











// ========================================
// DOWNLOAD TEMPLATE OSS
// ========================================


function downloadTemplateOSS(){



    let data=[



        {



            "Reference Code":"",


            "Cust ID":"",


            "Customer":"",


            "City":""



        }



    ];








    downloadExcelFile(


        data,


        "Template_OSS.xlsx"



    );



}











// ========================================
// DOWNLOAD TEMPLATE IMS
// ========================================


function downloadTemplateIMS(){



    let data=[



        {



            "WO":"",


            "Reference Code":"",


            "Quotation":"",


            "Job Name":"",


            "Status":"Progress",


            "Bulan":""



        }



    ];








    downloadExcelFile(


        data,


        "Template_IMS.xlsx"



    );



}











// ========================================
// DOWNLOAD HELPER
// ========================================


function downloadExcelFile(data,name){



    let ws =


    XLSX.utils.json_to_sheet(data);








    let wb =


    XLSX.utils.book_new();








    XLSX.utils.book_append_sheet(


        wb,


        ws,


        "Template"



    );








    XLSX.writeFile(


        wb,


        name



    );



}









// ========================================
// IMPORT BUTTON HELPER
// ========================================


function clearExcelInput(id){



    let el =


    document

    .getElementById(id);






    if(el){



        el.value="";



    }



}









// ========================================
// EXCEL READY
// ========================================


console.log(

"Excel Module Loaded"

);

// ========================================
// COMPATIBILITY BUTTON
// ========================================


function uploadOSS(){

    return uploadOSSExcel();

}



function uploadIMS(){

    return uploadIMSExcel();

}
