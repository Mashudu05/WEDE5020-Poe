/* ==========================================================
   Olive & Oak Café — FAQ accordion (jQuery)
   Loaded on enquiry.html after vendor/jquery
   ========================================================== */
$(function () {
    const $triggers = $('.accordion-trigger');
    const $panels = $('.accordion-panel');

    $panels.hide();   // panels start collapsed (visible if JavaScript is off)

    $triggers.on('click', function () {
        const $btn = $(this);
        const $panel = $('#' + $btn.attr('aria-controls'));
        const opening = $btn.attr('aria-expanded') !== 'true';

        // Only one panel open at a time
        $triggers.not($btn).attr('aria-expanded', 'false');
        $panels.not($panel).stop(true, true).slideUp(250);

        $btn.attr('aria-expanded', String(opening));
        $panel.stop(true, true).slideToggle(250);
    });
});
