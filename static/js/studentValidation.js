/**
 * Created by ranganathan on 11/3/16.
 */

$(document).ready(function() {

    $('select[name="application[ProjectPreference1]"]').change(function () {
        // hide all optional elements
        $('.member-type').hide();


        $("select[name='application[ProjectPreference1]'] option:selected").each(function () {
            var value = $(this).val();
            if(value == "xyz") {
                $('.member-type').show();

            }

        });
    });



    $('#studentform').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },

            fields: {
                'student[FirstName]': {
                    validators: {
                        stringLength: {
                            min: 3,
                        },
                        notEmpty: {
                            message: 'Please supply your first name'
                        }
                    }
                },


                'student[LastName]': {
                    validators: {
                        stringLength: {
                            min: 2,
                        },
                        notEmpty: {
                            message: 'Please supply your last name'
                        }
                    }
                },
                'student[Email]': {
                    validators: {
                        notEmpty: {
                            message: 'Please supply your email address'
                        },
                        emailAddress: {
                            message: 'Please supply a valid email address'
                        }
                    }
                },
                'student[Phone]': {
                    validators: {
                        notEmpty: {
                            message: 'Please supply your phone number'
                        },
                        phone: {
                            country: 'US',
                            message: 'Please supply a vaild phone number with area code'
                        }
                    }
                },
                'student[LocalAddressLine1]': {
                    validators: {
                        stringLength: {
                            min: 8,
                        },
                        notEmpty: {
                            message: 'Please supply your street address'
                        }
                    }
                },
                'student[LocalAddressCity]': {
                    validators: {
                        stringLength: {
                            min: 4,
                        },
                        notEmpty: {
                            message: 'Please supply your city'
                        }
                    }
                },
                'student[LocalAddressState]': {
                    validators: {
                        notEmpty: {
                            message: 'Please select your state'
                        }
                    }
                },
                'student[LocalAddressZip]': {
                    validators: {
                        notEmpty: {
                            message: 'Please supply your zip code'
                        },
                        zipCode: {
                            country: 'US',
                            message: 'Please supply a vaild zip code'
                        }
                    }
                },
                'student[PrimaryMajor]': {
                    validators: {
                        notEmpty: {
                            message: 'Please select your state'
                        }
                    }
                },

                'student[Race][]': {
                    validators: {
                        choice: {
                            min: 1,
                            max: 3,
                            message: 'Please choose a option'
                        }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow")
            $('#studentform').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // upload files
            getSignedRequest();

            /*
                 Function to carry out the actual POST request to S3 using the signed request from the Python app.
                 */
            function uploadFile(file, url1, file2, url2){

                $.ajax({
                   type: 'PUT',
                    url: url1,
                    data: file[0],
                    headers:['x-amz-acl', 'public-read'],
                    contentType: 'binary/octet-stream',
                    processData: false,
                    success: function (data,status) {
                        console.log(status);
                        if(status=='success') {
                            $.ajax({
                                type: 'PUT',
                                url: url2,
                                data: file2[0],
                                headers: ['x-amz-acl', 'public-read'],
                                contentType: 'binary/octet-stream',
                                processData: false,
                                success: function (data1, status1) {
                                    console.log(status1);
                                    if(status=="success") {
                                        // Use Ajax to submit form data
                                        $.post($form.attr('action'), $form.serializeJSON(), function (result) {
                                            if (result['status'] == 'OK')
                                                window.location.replace("/")
                                        }, 'json');
                                    }
                                }
                            });
                        }
                    }
                });
            }

        function getSignedRequest(){
            var file = document.getElementById('file-input').files;
            var file2 = document.getElementById('file-input1').files;
            $.ajax({
               type: "GET",
               crossDomain: true,
               url: `/sign-s3/?file-name=` + $(file)[0].name + `&file-type=` + $(file)[0].type + `&file-value=Resume&file-name2=`+ $(file2)[0].name +`&file-type2=`+ $(file2)[0].type +`&file-value2=CoverLetter`,
               success: function(data,status){
                   pdata = JSON.parse(data);
                   uploadFile(file, pdata.url1, file2, pdata.url2);
               }
            });
        }
    });


});
/*
jQuery(document).ready(function($){
    $('select[name="application[ProjectPreference1]"]').change(function () {
        // hide all optional elements
        $('.member-type').hide();


        $("select[name='application[ProjectPreference1]'] option:selected").each(function () {
            var value = $(this).val();
            if(value == "SKATER" || value == "HOCKEY" || value == "HOCKEYA") {
                $('.member-type').show();

           }

        });
    });
});*/