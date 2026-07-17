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
