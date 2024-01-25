import 'primevue/resources/themes/lara-light-blue/theme.css'
import PrimeVue from 'primevue/config'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu';
import ScrollPanel from 'primevue/scrollpanel';
import Avatar from 'primevue/avatar';
import Sidebar from 'primevue/sidebar';
import Panel from 'primevue/panel';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import InlineMessage from 'primevue/inlinemessage';
import Tooltip from 'primevue/tooltip';
import Paginator from 'primevue/paginator';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import OverlayPanel from 'primevue/overlaypanel';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Skeleton from 'primevue/skeleton';
import ProgressBar from 'primevue/progressbar';
import Message from 'primevue/message';
import Inplace from 'primevue/inplace';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';



function importPrimeVueComponents(app){
    app.component('Button', Button)
    app.component('InputText', InputText)
    app.component('Menu', Menu)
    app.component('ScrollPanel', ScrollPanel)
    app.component('Avatar', Avatar)
    app.component('Sidebar', Sidebar)
    app.component('Panel', Panel)
    app.component('Accordion', Accordion)
    app.component('AccordionTab', AccordionTab)
    app.component('TabView', TabView)
    app.component('TabPanel', TabPanel)
    app.component('Toast', Toast)
    app.component('InlineMessage', InlineMessage);
    app.component('Paginator', Paginator);
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('ColumnGroup', ColumnGroup);
    app.component('Row', Row);
    app.component('ConfirmDialog', ConfirmDialog);
    app.component('Dialog', Dialog);
    app.component('SelectButton', SelectButton);
    app.component('Tag', Tag);
    app.component('Toolbar', Toolbar);
    app.component('OverlayPanel', OverlayPanel);
    app.component('FileUpload', FileUpload);
    app.component('Dropdown', Dropdown);
    app.component('Checkbox', Checkbox);
    app.component('Skeleton', Skeleton);
    app.component('ProgressBar', ProgressBar);
    app.component('Message', Message);
    app.component('Inplace', Inplace);
    app.component('InputGroup', InputGroup);
    app.component('InputGroupAddon', InputGroupAddon);
    app.use(PrimeVue, { ripple: true })
    app.use(ToastService);
    app.use(ConfirmationService);
    app.directive('tooltip', Tooltip);
}

export default importPrimeVueComponents;
