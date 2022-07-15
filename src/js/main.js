window.CamelCase = {};

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['content-tyoe'] = 'application/json';

window.jQuery = window.$ = require('jquery');
require('bootstrap');
window.Noty = window.N = require('noty');
require('./helpers');

(function ($) {
    CamelCase.BankAPI().pupulateBank($('#banks'));
    $(function () {
        var accountInfo = {
                bank: 0,
                accountNo: '',
                bvn: '',
            },
            accountNumberOk = false;

        $('#account-no').on('keyup change', getBankName);
        $('#bank-form').on('submit', getBankName);

        if ($('#banks').length) $('#banks').on('change', getBankName);

        function getBankName(e) {
            e.preventDefault();
            var bankCode = $('#banks').val(),
                accountNo = $('#account-no').val(),
                accountName = $('#account-name'),
                accountNameInput = $('#account-name-holder'),
                getBankName;

            if (!bankCode || !accountNo) return;

            if (accountNo.length !== 10) return;

            // Try not to repeating the query when
            // Changes event occurs but the user made no changes
            if (
                accountNo == accountInfo.accountNo &&
                bankCode == accountInfo.bank
            )
                return;

            accountInfo.accountNo = accountNo;
            accountInfo.bank = bankCode;

            accountName
                .html('Getting account name, please wait..')
                .removeClass('invalid-feedback')
                .addClass('valid-feedback d-block');
            accountNumberOk = false;
            try {
                getBankName = CamelCase.BankAPI().getBankName(
                    bankCode,
                    accountNo
                );
                getBankName.then(
                    function (rs) {
                        var result = rs.data;
                        if (result.status !== false) {
                            accountName
                                .html(
                                    `Account Name: ${result.data.account_name}`
                                )
                                .removeClass('invalid-feedback')
                                .addClass('valid-feedback d-block');
                            accountNameInput.val(result.data.account_name);
                            $('#bank-name').val($('#banks :selected').text());
                            accountNumberOk = true;
                        } else {
                            accountName
                                .html(result.message)
                                .removeClass('valid-feedback')
                                .addClass('invalid-feedback d-block');
                        }
                        toggleSubmit();
                    },
                    function (xhr) {
                        const msg =
                            xhr?.response?.data?.message ||
                            'Cannot fetch Bank Name';
                        CamelCase.Notify.error(msg);
                        accountName.html('');
                        toggleSubmit();
                    }
                );
                // getBankName.error();
            } catch (e) {
                toggleSubmit();
            }
        }

        if ($('#bank-info-form').length)
            $('#bank-info-form').on('change', function () {});

        function toggleSubmit() {
            if (!accountNumberOk) {
                $('#go-bank-info').attr('disabled', 'disabled');
            } else {
                $('#go-bank-info').removeAttr('disabled');
            }
        }

        // Initially check if you scan submit
        toggleSubmit();
    });
})(jQuery);
