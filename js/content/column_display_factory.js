/*
  Copyright 2013 Krake Pte Ltd.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Author:
  Gary Teh <garyjob@krake.io>    
*/


/*
 * This class handles the creation of a column in the panel at the bottom of the page
 */
/*
   * @Param: params:object
   *         {
               columnId: string
               columnType: string
               columnName: string
               firstSelectionText: string (optional)
               secondSelectionText: string (optional)
               breadcrumb: string
             }
   */

var ColumnDisplayFactory = {
  
  recreateUIColumn: function(column){
    var self = this;
    var columnId = column.columnId;
    var type = column.columnType;
    var columnTitle = column.columnName;
    var elementLink = column.elementLink;
    var divKrakeColumnId = "krake-column-" + columnId;
    var columnNameId = "krake-column-title-" + columnId;
    var columnControlId =  "krake-column-control-" + columnId;


    var $wrapper = $("<div>", { id: divKrakeColumnId, class: "krake-column k_panel"});
    var $columnControl = $("<div>", { id: columnControlId, class: "krake-column-control k_panel" });    
    var $detailPageLink = PageDivingHandler.getLink(column);
    var editButtonImageUrl = "background-image: url(\"" + chrome.extension.getURL("images/edit.png") + "\");";
    var $editButton = $("<button>", { class: "k_panel krake-control-button krake-control-button-edit", style:  editButtonImageUrl });
    $editButton.bind('click', function(){});

    var breadcrumbId = "k_column-breadcrumb-" + columnId;
    var $breadcrumb = $("<div>", { id: breadcrumbId, class: "krake-breadcrumb k_panel" });
    column.is_alien && $breadcrumb.attr('title', 'go to page items were added').tooltip();

    var color_palette_id = "k_column-color-palette-" + columnId;
    var color_code = column.colorCode;
    column.is_alien && (color_code = '')
    var $color_palette = $("<div>", { id: color_palette_id, class: "krake-column-color-palette k_panel " + color_code });

    column.is_alien && $wrapper.addClass('krake_is_alien');
    var $columnName = $("<div>", {  id: columnNameId, 
                                    column_id: columnId,
                                    contenteditable: "true",
                                    class: "krake-column-row krake-column-title k_panel",
                                    text: columnTitle });


    $deleteButton = self.createDeleteButton(columnId, column.url);
    $columnControl = $columnControl.append($deleteButton);

    $wrapper.append($color_palette)
      .append($columnName)
      .append($breadcrumb)
      .append(
        $columnControl.append($detailPageLink).append($deleteButton)
      )

    return $wrapper;

  },



  createUIColumn: function(column_obj)
  {
    var self = this;
    var type = column_obj.columnType;
    var columnId = column_obj.columnId;
    
    var divKrakeColumnId = "krake-column-" + columnId;
    var columnTitleId = "krake-column-title-" + columnId;

    var $wrapper = $("<div>", { id: divKrakeColumnId, 
                                class: "krake-column k_panel"});
    
    var columnControlId =  "krake-column-control-" + columnId;
    var $columnControl = $("<div>", {  id: columnControlId,
                                       class: "krake-column-control k_panel" });
    
    $deleteButton = self.createDeleteButton(columnId, column_obj.url);    
    var $saveButton = $("<button>", { class: "k_panel krake-control-button-save k_btn",
                                      html : "Save",
                                      /* style:  saveButtonImageUrl, */
                                      title: "save column" });

    $saveButton.bind('click', function(){
      chrome.extension.sendMessage({ action: "save_column" }, function(response){
        if(response.status == 'success'){

          ColumnElementSelector.stop();
          
          //send mixpanel request
          MixPanelHelper.fireEvent(null, 'event_9');

          var columnIdentifier = "#krake-column-" + columnId;
          var selector = columnIdentifier + ' .krake-control-button-save';
          $(selector).remove();
          
          // remove visible tool tip just in case 
          $('.tooltip').remove();
          //ColumnDisplayFactory.addEditButton(columnId);
          
          ColumnElementSelector.setHighLightColor(false);          
          NotificationManager.showNotification({
            type : 'info',
            title : Params.NOTIFICATION_TITLE_SAVED_SELECTIONS,
            message : Params.NOTIFICATION_MESSAGE_SAVED_SELECTIONS,
            elements_to_highlight : [
              '#panel-left button#btn-create-list, #panel-left button#btn-done'
            ],
            anchor_element : '#panel-left button#btn-create-list, #panel-left button#btn-done'
          });
          
        } else {
          var columnIdentifier = "#krake-column-" + columnId;          
          NotificationManager.showNotification({
            type : 'error',
            title : Params.NOTIFICATION_TITLE_SAVE_COLUMN_FAILED,
            message : Params.NOTIFICATION_MESSAGE_SAVE_COLUMN_FAILED,
            anchor_element : columnIdentifier
          });
          
        }
        
        // Shows the pagingation link only when the column has been saved
        response.column && PageDivingHandler.showLink(response.column);        
        
        
      });
    });
    
    $saveButton.tooltip();

    var breadcrumbId = "k_column-breadcrumb-" + columnId;
    var $breadcrumb = $("<div>", { id: breadcrumbId,
                                   class: "krake-breadcrumb k_panel" });

    var $columnTitle = $("<div>", { id: columnTitleId, 
                                    column_id: columnId,
                                    class: "krake-column-row krake-column-title k_panel",
                                    contenteditable: "true",
                                    "data-placeholder": Params.DEFAULT_COLUMN_NAME });
    
    var color_palette_id = "k_column-color-palette-" + column_obj.columnId;
    var $color_palette = $("<div>", { id: color_palette_id, class: "krake-column-color-palette k_panel " + column_obj.colorCode });
    
    $columnControl = $columnControl.append($deleteButton);

    $wrapper.append($color_palette).append($columnTitle).append($breadcrumb).append(
        $columnControl.append($deleteButton).append($saveButton)
      );
        
    return $wrapper;
  },//eo createColumn
   
   
   
  addEditButton : function(columnId){
    //edit button
    var editButtonImageUrl = "background-image: url(\"" + chrome.extension.getURL("images/edit.png") + "\");";
    var $editButton = $("<button>", { class: "k_panel krake-control-button krake-control-button-edit", style:  editButtonImageUrl });

    $editButton.bind('click', function(){
      chrome.extension.sendMessage({ action: "stage_column", params : { columnId : columnId } }, function(response){
        if(response.status == 'success'){ }
      });
    });

    var selector = "#krake-column-control-" + columnId; 
    $(selector).append($editButton);
  },


  createDeleteButton : function(column_id, column_url) {
    var self = this;
    var $deleteButton = $("<button>", { 
      class: "krake-control-button k_panel krake-control-button-delete", 
      style: "background-image: url(\"" + chrome.extension.getURL("images/bin.png") + "\");",
      column_id: column_id,
      column_url: column_url
    });

    $deleteButton.bind('click', function() {
      NotificationManager.hideAllMessages();
      chrome.extension.sendMessage({ action: "delete_column", params: { columnId : column_id, url : column_url }}, function(response) {
        if(response.status == 'success'){
          $("#krake-column-" + column_id).remove();
          ColumnElementSelector.unHighlightElements(response.deletedColumn);
          if(response.session.currentState == 'idle') {
            ColumnElementSelector.stop();
          }
        }
      });

    });

    $deleteButton.tooltip();
    return $deleteButton;
  }



};//eo ColumnDisplayFactory
