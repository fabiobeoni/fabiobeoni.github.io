var feedback = {};

feedback['java'] = [
        "This snippet is vulnerable to XSS as it takes the query parameter 'e' and includes it in the page as it is, without performing any validation or encoding.",
        "This snippet is not vulnerable because the &lt;c:out&gt; tag performs HTML encoding of the input automatically. However, don't forget that if <tt>escapeXML=false</tt> is specified, the output will not be encoded and you'll be vulnerable to XSS.",
        "This snippet shows a simple white-list approach. The <tt>sanitise()</tt> method uses a regular expression to only allow alphanumeric characters, thus preventing the attacker for inserting any malicious character.", 
        "This snippet implements a very naive black-list, stripping every instance of a script tag. However, this can be trivially bypassed by using a different case for the tags, such as <tt>&lt;sCrIpT&gt;</tt> or by resorting to any other tag where event handlers can be used, such as <tt>&lt;img src=\"non_exist\" onerror=\"alert(1)\"&gt;</tt>."
    ];

feedback['dotnet'] = [
        "This snippet is vulnerable to XSS as it takes the query parameter 'e' and includes it in the page as it is, without performing any validation or encoding.",
        "This snippet is not vulnerable because explicit HTML encoding of the untrusted input is performed using the <tt>HtmlEncode()</tt> method.",
        "This snippet shows a simple white-list approach. The <tt>sanitise()</tt> method uses a regular expression to only allow alphanumeric characters, thus preventing the attacker for inserting any malicious character.", 
        "This snippet implements a very naive black-list, stripping every instance of a script tag. However, this can be trivially bypassed by using a different case for the tags, such as <tt>&lt;sCrIpT&gt;</tt> or by resorting to any other tag where event handlers can be used, such as <tt>&lt;img src=\"non_exist\" onerror=\"alert(1)\"&gt;</tt>."
    ];   

function resizeCodeArea() {
    // Handle window resizing
    var tabsHeaderHeight = $('.tabs').outerHeight();
    //var notesDivHeight = $('.notes').outerHeight();
    var notesDivHeight = 0;
    $('.pre-code').height(window.innerHeight - tabsHeaderHeight - notesDivHeight);
}

function disableItems() {
    $(".answer").attr("disabled", true);
}

function enableItems() {
    $(".answer").removeAttr("disabled");
}

function resetItems() {
    $(".answer").attr('checked', false);
}

function showFeedback() {
    $('.to-highlight').addClass('highlighted');
    
    // set individual feedback
    $('.tooltiptext').removeClass('hide')
    var tooltiptexts = $('.tooltiptext');
    for (var i = 0; i < tooltiptexts.length; i++) {
        tooltiptexts[i].innerHTML = feedback[lang][i];
    }
    
    resizeCodeArea();
}

function setIndividualFeedback(index, correct) {
    vulnCheckboxes = $('.vuln-container').length
    if (index > vulnCheckboxes.length) {
        return;
    }

    if (correct) {
        $('.vuln-container').eq(index).addClass('vuln-container-right')
    } else {
        $('.vuln-container').eq(index).addClass('vuln-container-wrong')
    }
}

$(function () {
    $("#tabs").tabs();

    resizeCodeArea();
    $(window).resize(function () {
        resizeCodeArea();
    });

    // Sync scrolling betwwen code and line number panes
    $('code.main-pane').on('scroll', function () {
        var line_numbers = $(this).prev('code.hljs.hljs-line-numbers')
        line_numbers.scrollTop($(this).scrollTop());
    });

    // set receiver of messages from adapt parent frame
    $(window).on("message", function (e) {
        if (e.origin !== location.origin) {
            return;
        }
    });

    parent.postMessage("Hello", location.origin);

});

