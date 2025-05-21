document.addEventListener('DOMContentLoaded', () => {
   const old_theme = localStorage.getItem('theme');

   switch (localStorage.getItem('theme')) {
      case 'white-mode':
         document.getElementById('theme_select').selectedIndex = 0;
         break;
      case 'dark-mode':
         document.getElementById('theme_select').selectedIndex = 1;
         break;
      case 'gray-mode':
         document.getElementById('theme_select').selectedIndex = 2;
         break;
      default:
         document.getElementById('theme_select').selectedIndex = 0;
   }
   
   const select = document.getElementById("theme_select");
                   
   if (select) {select.addEventListener('change', (event) => {
         const selectedValue = event.target.value;     
         localStorage.setItem('theme', selectedValue);
         localStorage.setItem('confirmation', 1);
         localStorage.setItem('old_theme', old_theme);

      })
   }
})