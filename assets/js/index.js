(function() {
  // Entity logos use loading="lazy" so off-screen ones don't fetch until
  // scrolled into view. Browsers don't reliably force-load them before
  // printing, so images below the fold can end up missing from the
  // printout. Switching them to eager right before printing (native
  // Ctrl+P/File>Print included, via beforeprint) fixes that without
  // changing how images load during normal browsing.
  function loadLazyImagesForPrint() {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = "eager";
    });
  }

  document.getElementById("print").onclick = () => {
    loadLazyImagesForPrint();
    window.print();
  };

  window.addEventListener("beforeprint", loadLazyImagesForPrint);

  // beforeprint alone can fire too close to the browser's print snapshot
  // for a not-yet-started fetch to finish in time (e.g. native Ctrl+P).
  // Prefetching everything shortly after the page settles means it's
  // normally already cached by the time anyone prints, without delaying
  // the initial page load.
  window.addEventListener("load", () => {
    setTimeout(loadLazyImagesForPrint, 1000);
  });
})();
