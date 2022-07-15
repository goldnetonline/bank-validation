+(function (w, $) {
    'use strict';
    CamelCase.BankAPI = function () {
        var bankEndpoint = '/bank/',
            apiEndpoint = '/paystack';

        function get(endPoint) {
            return axios.get(apiEndpoint, {
                params: {
                    endpoint: endPoint,
                },
            });
        }

        // Public API here
        return {
            getBanks: function () {
                return get(bankEndpoint);
            },

            getBankName: function (bankCode, accountNumber) {
                if (!accountNumber || !bankCode) return false;

                if (accountNumber.length !== 10) return false;

                return get(
                    bankEndpoint +
                        'resolve?account_number=' +
                        accountNumber +
                        '&bank_code=' +
                        bankCode
                );
            },

            validateBVN: function (bvn) {
                if (!bvn || bvn == '') return;

                if (bvn.length !== 11) return;

                return get(bankEndpoint + 'resolve_bvn/' + bvn);
            },

            matchBVN: function (accountNumber, bankCode, bvn) {
                if (!accountNumber || !bankCode || !bvn) return false;

                if (accountNumber.length !== 10) return false;

                if (bvn.length !== 11) return;

                return get(
                    bankEndpoint +
                        'match_bvn?account_number=' +
                        accountNumber +
                        '&bank_code=' +
                        bankCode +
                        '&bvn=' +
                        bvn
                );
            },

            pupulateBank: function (elem) {
                if (typeof elem === undefined) return;

                this.getBanks()
                    .then(function (rs) {
                        var response = rs.data;
                        var options = '';
                        if (response.data.length !== 0) {
                            for (var i = 0; i < response.data.length; i++) {
                                options +=
                                    "<option value='" +
                                    response.data[i].code +
                                    "'>" +
                                    response.data[i].name +
                                    '</option>';
                            }
                            $(elem).html(
                                '<option value="">--Select Bank--</option>' +
                                    options
                            );
                            CamelCase.Helper.selectOption();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        CamelCase.Notify.error(
                            'Cannot get bank list, please refresh the pageto try again '
                        );
                    });
            },
        };
    };

    CamelCase.Helper = {
        showSpinner: function (show, message, successSpinner) {
            var submitBtn = $('.cc-action-button'),
                spinner = $('.cc-spinner'),
                spinnerText = $('.spinner-text');
            if (!show) {
                spinner.addClass('hidden').removeClass('success');
                submitBtn.removeClass('hidden');
            } else {
                spinner.removeClass('hidden');
                spinnerText.text(message || 'Please wait...');
                submitBtn.addClass('hidden');

                if (successSpinner) spinner.addClass('success');
            }
        },
        getCookie: function (name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        },
        selectOption: function () {
            $('select').each(function () {
                var flashed = $(this).attr('data-flash');
                if (!flashed || flashed == '') return;

                $('option', this).each(function (i, e) {
                    var $thisValue = $(this).attr('value').trim();
                    if ($thisValue == flashed.trim()) {
                        $(this).attr('selected', 'selected');
                    }
                });
            });
        },

        /**
         * Compile HTML string with context data
         * @param {string} htmlString The HTML String to compile
         * @param {object} context The context data
         *
         * @return {string} The compile html
         */
        compileHTML: function (htmlString, context) {
            if (!htmlString || !context) return htmlString;

            if (typeof context !== 'object') return htmlString;

            var div = $('<div />').html(htmlString);

            for (var c in context) {
                if (context.hasOwnProperty(c)) {
                    var cHtml = div.find("[data-compile='" + c + "']");
                    if (cHtml) cHtml.html(context[c]);
                }
            }

            return div.html();
        },

        formatNumber: function (n) {
            return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },

        readQueryString: function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },

        string2Object: function (obj, i) {
            return obj[i];
        },

        getNaira: function () {
            return '₦';
        },

        objectifyForm: function (formArray) {
            //serialize data function

            var returnArray = {};
            for (var i = 0; i < formArray.length; i++) {
                returnArray[formArray[i]['name']] = formArray[i]['value'];
            }
            return returnArray;
        },

        scrollTo: function (elem, paddingTop) {
            paddingTop = paddingTop || 0;
            $('html, body').animate(
                {
                    scrollTop: $(elem).offset().top - paddingTop,
                },
                'slow'
            );
        },

        validateEmail: function (email) {
            var pattern =
                /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            return pattern.test(email);
        },

        validateNumber: function (num) {
            return !isNaN(parseInt(num));
        },

        validatePassword: function (string) {
            // var pattern = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
            // return pattern.test(string);
            return string.length >= 6;
        },

        validatePhone: function (phone) {
            var pattern = /^\+?(?:[0-9] ?){6,14}[0-9]$/;
            return pattern.test(phone);
        },

        nl2br: function (str, isXhtml) {
            if (typeof str === 'undefined' || str === null) {
                return '';
            }
            // Adjust comment to avoid issue on locutus.io display
            var breakTag =
                isXhtml || typeof isXhtml === 'undefined'
                    ? '<br ' + '/>'
                    : '<br>';
            return (str + '').replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1');
        },

        errorHandler: function (message) {
            CamelCase.Notify.error(message);
        },

        isValidDomElement: function (elem) {
            if (typeof elem != 'object') {
                var msg = 'Invalid element';
                throw msg;
                this.errorHandler(msg);
                return false;
            }
            return true;
        },

        debugLog: function () {
            if (typeof console !== 'undefined') {
                console.log.apply(console, arguments);
            }
        },

        getRandomString: function (len) {
            var len = len || 6;
            return Math.random().toString(36).substring(len);
        },
    };

    CamelCase.Notify = {
        _notify: function (text, opt) {
            if (CamelCase.no_noty) return;
            opt = opt || {};
            var options = CamelCase.notificationOptions || {
                layout: 'topCenter',
                timeout: 6000,
                theme: 'metroui',
                closeWith: ['click', 'button'],
                progressBar: true,
                modal: false,
            };

            $.extend(options, opt, {
                text: "<p style='text-align:center'>" + text + '</p>',
            });
            if (text === null || !window.Noty) {
                console.log('No text input or Noty engine not found');
                return false;
            }
            return new Noty(options).show();
        },
        error: function (text) {
            this._notify(text, {
                type: 'error',
            });
        },
        success: function (text) {
            this._notify(text, {
                type: 'success',
            });
        },
        warning: function (text) {
            this._notify(text, {
                type: 'warning',
            });
        },
        alert: function (text) {
            this._notify(text, {
                type: 'alert',
            });
        },
        info: function (text) {
            this._notify(text, {
                type: 'info',
            });
        },

        topNotify: function (message) {
            var messageContainer = $('#do-notify'),
                wrapper = $('#do-notify-wrapper');

            wrapper.css('height', '0px');
            messageContainer.html(message);

            wrapper.css('height', '80px');

            CamelCase.Helper.scrollTo(wrapper);
        },
    };

    w.q = (elem) => {
        return document.querySelector(elem);
    };
})(window, jQuery);
