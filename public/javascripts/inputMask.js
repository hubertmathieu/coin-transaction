
$( window ).on( "load", function() {
    creditInput();
    amountInput();
});



function creditInput() {
    var target = $(".credit-input")
    console.log(target)
    target.each(function (index,value) {
        var numberMask = IMask(value, {

            // enable number mask
            mask: Number,
            // other options are optional with defaults below
            // digits after point, 0 for integers
            scale: 0,

            // disallow negative
            signed: false,

            // any single char
            thousandsSeparator: '',

            // if true, then pads zeros at end to the length of scale
            padFractionalZeros: false,

            // appends or removes zeros at ends
            normalizeZeros: true,

            // fractional delimiter
            radix: '.',

            // additional number interval options (e.g.)
            min: 1000000000000000,
            max: 9999999999999999
        });
    })
}

function amountInput() {
    var target = $(".amount-input")
    console.log(target)
    target.each(function (index,value) {
        var numberMask = IMask(value, {

            // enable number mask
            mask: Number,
            // other options are optional with defaults below
            // digits after point, 0 for integers
            scale: 2,

            // disallow negative
            signed: false,

            // any single char
            thousandsSeparator: '',

            // if true, then pads zeros at end to the length of scale
            padFractionalZeros: false,

            // appends or removes zeros at ends
            normalizeZeros: true,
            // fractional delimiter
            radix: '.',

            // additional number interval options (e.g.)
            min: 0.01,
            max: 9999999999999999
        });
    })

}
