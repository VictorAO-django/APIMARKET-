//Window Error Function
function showErr(msg,URL,lineNum,columnNo,error){
    var errWin = window.open("","osubWin","width=650px,height=600px")
    var winText = "<html><title>Error Window</title>"
    winText += "<body> <p>MSG: " + msg + ".</p>"
    winText += "<p>Document URL: " + URL + ".</p>"
    winText += "<p>Document COLUMN: " + columnNo + ".</p>"
    winText += "<p>Document ERROR: " + console.error(); + ".</p>"
    winText += "<p>Line Number: " + lineNum + ".</p>"
    winText += "</body></html>"
                
    errWin.document.write(winText);
    var oWidth = ((screen.availWidth - 650)/2);
    var oHeight = ((screen.availHeight - 600)/2);
    errWin.moveTo(oWidth,oHeight);
    return true;
}
window.onerror = showErr;

function showDropDown(LiIdentifier,DropdownIdentifier,mode){
    var dropdown = document.getElementsByClassName(DropdownIdentifier)[0]
    var Li = document.getElementsByClassName(LiIdentifier)[0]
    if(mode == 'show'){
        dropdown.style.display = 'flex'
        Li.href = "javascript:showDropDown('" + LiIdentifier + "','" + DropdownIdentifier +"','hide')"
    }else{
        dropdown.style.display = 'none'
        Li.href = "javascript:showDropDown('" + LiIdentifier + "','" + DropdownIdentifier +"','show')"
    }  
}


function createNavigation(contents,identifier){
    // the parameter('contents') is in the form of:
    //      ['name','name.png','/url',[['dropdown','dropdown.png','/url']],
    //This function is basically to return a single Li element where:
    //'name' = the Li innerText
    //'.png' = the Li Icon
    //'/url' = the Li Url
    //'dropdown' = the dropdown innerText
    //'name' & 'url' are the required parameters, the others can be ommited without any errors occuring

    var List = document.createElement('li')//Create the Li element
    List.className = identifier
    var ListAnchor = document.createElement('a')//Create the inner anchor element
    ListAnchor.id = 'na-me'
    ListAnchor.className = 'DropDownAnchor' + Math.ceil(Math.random() * 30 + 1) + Math.floor(Math.random() * 60 + 30)
    var ListIcon = document.createElement('img')//Create the Li icon incase the value is provided
    var ListDropdown = document.createElement('ul')//Create the DropDown Ul in case the value is provided
    ListDropdown.className = 'DropDownUl' + Math.ceil(Math.random() * 30 + 1) + Math.floor(Math.random() * 60 + 30)
    ListDropdown.id = 'DropDownUl'
    List.appendChild(ListAnchor)

    var parameters = {};//Create a JSON for the parameters
    if(contents.length <= 4){//check if the parameters provided does not exceed than 4 contents
        for(var i = 0; i<contents.length; i++){//loop through each contents
            if(contents[i].includes('.png')){//if the content have '.png' then it is the Icon src
                parameters["Src"] = contents[i]
            }else if(contents[i].includes('/')){//if the content have'/' then it is the Li url
               parameters["Url"] = contents[i]
            }else if(typeof contents[i] == 'object'){//if the content is an object then is it a dropdown
                parameters["DropDown"] = contents[i]
            }else{//if the content is not of any case above, then it is the Li innerText
                parameters["Name"] = contents[i]
            }
        }
    }else{//if the parameters provided exceeds 4 contents, then alert the user
        alert('error')
    }
    
    var VerifyParameters;
    if(parameters['DropDown']){
        VerifyParameters = (parameters['Name'])? true:false//this helps to check if the value for innerText and url are provided
        parameters['Url'] = "javascript:showDropDown('"+ ListAnchor.className +"','" + ListDropdown.className +"','show')"
    }else{
        VerifyParameters = (parameters['Name'] && parameters['Url'])? true:false//this helps to check if the value for innerText and url are provided
    }
    

    if(VerifyParameters){//if innerText value and url are provided
        ListAnchor.href = parameters['Url']
        ListAnchor.innerText = parameters['Name']
        
        if(parameters['Src']){//if icon src is provided
            ListIcon.src = parameters['Src']
            ListIcon.className = 'ApiIcon'
            ListAnchor.insertBefore(ListIcon,ListAnchor.firstChild)
        }

        if(parameters['DropDown']){//if dropdown is provided
            for(var i = 0; i<parameters['DropDown'].length; i++){
                var DropDownDetails = createNavigation(parameters['DropDown'][i],'DropDownList')
                ListDropdown.appendChild(DropDownDetails)

            }
            var DropDownArrow = document.createElement('img')
            DropDownArrow.src = 'arrow_drop_down_FILL0_wght400_GRAD0_opsz24.svg'
            DropDownArrow.className = 'DropDownArrow'

            ListDropdown.style.display ='none'
            List.appendChild(ListDropdown)
            ListAnchor.appendChild(DropDownArrow)
        }
        return List
    }else{
        alert('error')
    }
}

function NavigationAPI(content,mode,colorcode,defaultsize,template){
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //This is the Navigation Object that Generate the Navigation Elements needed from the provided attributes of the user.
    //This Object require 5 attributes. All attributes are required. If there's any of the attribute the user cannot provide
    //a value for, then 'default' should be placed instead.
    //
    //++++++++++++++++++++++++++++++++++++++++++++
    //
    //FIRST ATTRIBUTE('content') must be an 'object' type, else a custom alert will popup for the awareness of the user
    //Here the user provide the value in this order:
    //      [
    //          ['name1','name1.png','/url',[['dropdown1','dropdown1.png','/url'],['dropdown2','dropdown2.png','/url']]],
    //
    //          ['name2','name2.png','/url'],
    //      ] 
    //the first attribute is the main part of the navigationApi because this contains the whole navigation details. From the above,
    //the datatype object used is known as array, to use the api we need to create nested array where each nested array represents
    //a list element.
    //'name1' represents the name to be displayed for the list, 
    //'.png' represents the icon of the corresponding list, 
    //'/url' represents the url of the corresponding list,
    //'the array in the list parameter represents dropdown, where we can input nested array in other to create the list in the dropdown'.
    // NOTE that the 'name' and '/url' are the essential parts of this attribute 'url', the others can be ommitted. If the 'name' and 'url'
    //are not provided, a custom alert will popup for the uawareness of the user
    //
    //++++++++++++++++++++++++++++++++++++++++++++++++
    //SECOND ATTRIBUTE('mode') is always a string
    //
    this.content = content || [];
    this.mode = mode || 'verticalLeft';
    this.colorcode = colorcode || 'black';
    this.defaultsize = defaultsize || 'max';
    this.template = template || 'template_1';

    var availableMode = ['verticalLeft','verticalRight','horizontalTop','horizontalBottom']
    var availableTemplate = ['template_1','template_2','template_3','template_4']

    const contentCheck = (typeof this.content == 'object')? true : false;
    const modeCheck = (availableMode.includes(this.mode))? true : false;
    const templateCheck = (availableTemplate.includes(this.template))? true : false;

    this.Enable = function(){
        var NavigationBar = document.createElement('div')
        var NavigationUL = document.createElement('ul')
        for(var i = 0; i<this.content.length; i++){
           NavigationUL.appendChild(createNavigation(this.content[i],'ApiList'))
        }
        NavigationBar.appendChild(NavigationUL)
        document.body.appendChild(NavigationBar)
    }
    
}


 function doThis(){
    var x = new NavigationAPI(
        [
            ['home','books.png','/home'],

            ['contact','books.png',[['aboutbusiness','books.png','/abou'],['developercontact','books.png','/cont']]],
            
            ['about','books.png',[['aboutbusiness','books.png','/abou'],['developercontact','books.png','/cont']]]
            
        ],
        'vertical',
        'blue',
        'min',
        'template1'
    );
    x.Enable()
 }

 window.onload = function(){
    //doThis()
 }