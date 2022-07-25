// Tabs

/* 
tabsDescription :
    tabsSelector:
    contentSelector:
    parentSelector:
    classActive:
    classTab:
*/

function tabs(tabsDescription) {
    
	let tabs = document.querySelectorAll(tabsDescription.tabsSelector),
		tabsContent = document.querySelectorAll(tabsDescription.contentSelector),
		tabsParent = document.querySelector(tabsDescription.parentSelector);

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove(tabsDescription.classActive);
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(tabsDescription.classActive);
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains(tabsDescription.classTab)) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
    });
}

export default tabs;