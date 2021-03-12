
//  toggle button
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $(".main-content__sidebar").toggleClass("toggled");
    $(".main-content").toggleClass("toggled");
});


