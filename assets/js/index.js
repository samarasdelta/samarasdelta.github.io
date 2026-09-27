(function() {
  var MAX_PRINT_PAGES = 2;
  var DEFAULT_ZOOM = 0.646;
  var MIN_ZOOM = 0.35; // floor so text never shrinks past legibility
  var SAFETY_FACTOR = 0.97; // small buffer against measurement/rounding

  // There's no CSS way to cap a printout at N pages - browsers don't
  // expose page count to CSS or JS. The closest reliable approach is to
  // measure the real content height right before printing and shrink the
  // print zoom just enough to fit it in the page budget, recomputed fresh
  // every time so it keeps working as content is added or removed later.
  function fitPrintToPages() {
    var wrapper = document.querySelector(".wrapper");
    if (!wrapper) return;

    var pageHeightPx = 297 * (96 / 25.4); // A4 height, matches print.css's @page size
    var paddingPx = 10 * (96 / 72); // matches print.css's html/body padding: 10pt
    var usablePerPagePx = pageHeightPx - 2 * paddingPx;
    var budgetPx = MAX_PRINT_PAGES * usablePerPagePx;

    var previousZoom = document.body.style.zoom;
    document.body.style.zoom = "1"; // measure unscaled content height
    var contentHeightPx = wrapper.scrollHeight;
    document.body.style.zoom = previousZoom;

    if (!contentHeightPx) return;

    var neededZoom = (budgetPx * SAFETY_FACTOR) / contentHeightPx;
    neededZoom = Math.min(neededZoom, DEFAULT_ZOOM);
    neededZoom = Math.max(neededZoom, MIN_ZOOM);

    document.documentElement.style.setProperty("--print-zoom", neededZoom);
  }

  document.getElementById("print").onclick = () => {
    fitPrintToPages();
    window.print();
  };

  // Covers native Ctrl+P / File > Print too, not just the in-page button.
  window.addEventListener("beforeprint", fitPrintToPages);
})();
