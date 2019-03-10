import $ from "jquery";

export const menu = () => {
  $('.burger, .menu-backdrop, .menu-link').on('click', toggleMenu);

  function toggleMenu(e) {
    e.preventDefault();
    $('.burger').toggleClass('active');
    $('.menu').toggleClass('opened');
  }
}