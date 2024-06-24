# Using the Capture app { #capture_app } 

## About the Capture app { #about_capture_app } 

In the Capture app you register events that occurred at a particular time and place. An event can happen at any given point in time. This stands in contrast to routine data, which is captured for predefined, regular intervals. Events are sometimes called cases or records. In DHIS2, events are linked to a program. The Capture app lets you select the organisation unit and program and specify a date when an event happened, before entering information for the event. Some events are linked to a tracked entity instance, for example a person, allowing longitudinal follow-up.

## Register an event { #capture_register_event } 

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select an event program.

    You will only see programs associated with the selected organisation unit and programs you have access to, and that are shared with your user group through data level sharing.

4. If the program has a category combination set the category option will have to be selected.

5. Click **Create new event**.

    ![create new event](resources/images/create_new_event.png)

6. Fill in the required information. If the programs program stage is configured to capture a location:

    - If the field is a coordinate field you can either enter the coordinates
    directly or you can click the **map** icon to the left of the coordinate field.
    The latter one will open a map where you can search for a location or set on
    directly by clicking on the map.

    - If the field is a polygon field you can click the **map** icon to the left of
    the field. This will open a map where you can search for a location and capture
    a polygon (button in the upper right corner of the map).

7. If desired, you can add a note by clicking the **Write note** button at the bottom of the form. Be aware that Event notes are attributed to a user and cannot be deleted. 

8. If desired you can add a relationship by clicking the **Add relationship** button at the bottom of the form.
   See the section about **Adding a relationship** for more information.

9. Click **Save and exit** or click the arrow next to the button to select **Save and add another**.

    - **Save and add another** will save the current event and clear the form.
    All the events that you have captured will be displayed in a list at the bottom of the page.
    When you want to finish capturing events you can, if the form is blank,
    click the finish button or if your form contains data click the arrow
    next to **Save and add another** and select **Save and exit**.

> **Note**
>
> Some data elements in an event might be mandatory (marked with a red star next to the data element label).
> All mandatory data elements must be filled in before the user is allowed to complete the event.
> The exception to this is if the user has the authority called __"Ignore validation of required fields in Tracker and Event Capture".__
> If the user has this authority, the mandatory data elements will not be required and
> the red star will not be displayed next to the data element label. Note that super user that have the __"ALL"__ authority automatically
> have this authority.

> **Tip**
>
> The data entry form can also be displayed in **row view**. In this mode the data elements are arranged horizontally. This can be
> achieved by clicking the **Switch to row view** button on the top right of the data entry form. If you are currently in **row view** you
> can switch to the default form view by clicking the **Switch to form view** button on the top right of the data entry form.

## Register a tracked entity instance

There are two different ways one can register a tracked entity instance under an organisation unit.
The first way, is to register a tracked entity instance without enrolling it to a tracker program.
The second option, is to register a tracked entity instance with program and enroll it. 

### Without a program enrollment 

1. Open the **Capture** app.

2. Select an organisation unit.

3. Click **Create new**.

    ![image](resources/images/register-without-enrollment-new-button.png)

    You'll now be navigated to the registration page. In that page you will see a drop down 
    menu similar to the one in the image below. From the dropdown menu you can select a tracked entity 
    type, eg. Building, Person etc.
    
    ![image](resources/images/register-without-enrollment-dropdown-menu.png)

4. Select the tracked entity type which you want to create a new instance for.
 
    ![image](resources/images/register-without-enrollment-dropdown-menu-with-arrow.png)
    
5. The moment you select a tracked entity type, a form will be shown on the screen. 
    
    The "Profile" section will be shown. In this section you can add data relevant to the 
    tracked entity instance. The profile section mainly contains all the tracked entity attributes
    linked to the tracked entity type. 

    ![image](resources/images/register-without-enrollment-form.png)

6. Fill in the required information.

    If the tracked entity type is configured to capture a location:

    - If the field is a coordinate field you can either enter the coordinates
    directly or you can click the **map** icon to the left of the coordinate field.
    The latter one will open a map where you can search for a location or set on
    directly by clicking on the map.

    - If the field is a polygon field you can click the **map** icon to the left of
    the field. This will open a map where you can search for a location and capture
    a polygon (button in the upper right corner of the map).

7. Click the **Save person** button to register the tracked entity instance. 
    
8. You will now be prompted to the tracked entity instance dashboard. 

    The dashboard will show relevant information about the newly created tracked entity instance.

### With a program enrollment

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a tracker program of your choice.

4. Click **Create new person**. Note that the label of this button corresponds to the tracked entity type of the program, which could vary, such as "Building," "Person," etc.

    ![create new event](resources/images/register-and-enroll-program-selection.png)
 
5. Now, you will be able to see a form similar to the image below. 

    The enrollment form has different layouts depending on how the program is customized. The top section has the title "Enrollment",
    and it holds all the relevant information about the enrollment details. This section will always be present, regardless of layout.
    Underneath, the different data input fields relevant to the tracked entity instance will be displayed. 
    These fields will either be displayed within sections or as a completely custom form. 
    The sections, or custom form, mainly contains all the tracked entity attributes linked to the program or tracked entity type.

      ![create new event](resources/images/register-and-enroll-form.png)

6. Fill in the required information for the enrollment.
    If the tracked entity type is configured to capture a location:

    - If the field is a coordinate field you can either enter the coordinates
    directly or you can click the **map** icon to the left of the coordinate field.
    The latter one will open a map where you can search for a location or set on
    directly by clicking on the map.

    - If the field is a polygon field you can click the **map** icon to the left of
    the field. This will open a map where you can search for a location and capture
    a polygon (button in the upper right corner of the map).

7. Click **Save person** to register the tracked entity instance. 
    The **Save** button shows a loading spinner and the **Cancel** button is disabled while the request is processing.
    
8. You will now be prompted to the tracked entity instance dashboard. 

    The dashboard will show relevant information about the newly created tracked entity instance.

> **Note**
>
> Some data elements in an event might be mandatory (marked with a red star next to the data element label).
> All mandatory data elements must be filled in before the user is allowed to complete the event.
> The exception to this is if the user has the authority called __"Ignore validation of required fields in Tracker and Event Capture".__
> If the user has this authority, the mandatory data elements will not be required and
> the red star will not be displayed next to the data element label. Note that super user that have the __"ALL"__ authority automatically
> have this authority.

> **Tip**
>
> The data entry form can also be displayed in **row view**. In this mode the data elements are arranged horizontally. This can be
> achieved by clicking the **Switch to row view** button on the top right of the data entry form. If you are currently in **row view** you
> can switch to the default form view by clicking the **Switch to form view** button on the top right of the data entry form.

### Enrollment with auto generated events 

Events can automatically be created when enrolling in a program.

To automatically generate events, you can do the necessary configuration in the maintenance app.
1. Open the maintenance app

2. Select the Program tab
![](resources/images/auto-generated-01.png)

3. Select a Tracker program
![](resources/images/auto-generated-02.png)

4. Select the Program stages tab
![](resources/images/auto-generated-03.png)

5. Click on the program stage you would like to generate an event for
![](resources/images/auto-generated-04.png)

6. Select "Auto-generate event"
![](resources/images/auto-generated-05.png)

You can set multiple program stages within a program to be auto-generating (this will create an event for each program stage configured this way)

### Enrollment with open data entry form

A program can be configured to automatically take the user to register a new event immediately after enrolling a tracked entity instance. To enable this behavior, the program must have at least one program stage with the "Open data entry form after registration" option checked. If more than one program stage has this option enabled, the first stage will be used.

To configure it, you must follow the steps described in the [Enrollment with auto generated events](#enrollment-with-auto-generated-events) section and then check the option "Open data entry form after enrollment".

### Enrollment with first stage on registration page

For tracker programs enable the "First stage appears on registration page" flag in the Maintenance. The enrollment registration page will now display the first program stage the user has access to.

![](resources/images/first-stage-during-registration.png)

#### Active type of event

If the stage has the "Open data entry form after enrollment" selected, then the event will be generated into the ACTIVE status. Also its execution date will be calculated for the event, in addition to a due date.
The generation happens based on either the enrollment date or the incident date. You can choose the reporting date from the dropdown menu "Report date to use".
![](resources/images/auto-generated-06.png)

As shown in the image you have three options, a) Incident date b) Enrollment date or c) No value. 
Choosing reporting date as "Incident date" indicates that both the event execution date and due date will be the same as the incident date.
Choosing reporting date as either "Enrollment date" or "No value" indicates that both the event execution date and due date will be the same as the enrollment date.

#### Schedule type of event

When the "Open data entry after enrollment" is not checked, it means that the event generated will be a SCHEDULE event. 
The scheduled event does not have an execution date, but only a due date. The due date for these future events are calculated based on either enrollment date or incident date. If the flag below is checked, the reference date is the enrollment date, if the flag is not checked, the incident date is used.
![](resources/images/auto-generated-07.png)

When there is no incident date, the reference date will fall back on the enrollment date regardless of whether the flag above is checked.

On SCHEDULE type of events the user can also configure the "Scheduled days from start". Which means if a stage has a number in "Scheduled days from start" the reference date will increased by that number. 
In the example below we increase the due date by 30 days.

![](resources/images/auto-generated-08.png)

When the "Scheduled days from start" does not contain a number or contains 0 the reference date is used without adding any days to it.


### Possible duplicates detection

In both cases of registering a tracked entity instance, (with enrollment or without enrollment) the system will start looking for possible duplicates.
Note that programs need to be correctly configured through the maintenance app for the system to start detecting duplicates when enrolling a new person in a program. 

To configure a program through the maintenance app you will have to: 


1. Open the maintenance app.
![](resources/images/duplicates-maintenance-config-00.png)

2. In the program section select your program. We select Child Programme for this example.
![](resources/images/duplicates-maintenance-config-01.png)

3. Select the Attributes tab.
![](resources/images/duplicates-maintenance-config-02.png)

4. Enable duplicates search by checking program attributes as searchable
![](resources/images/duplicates-maintenance-config-03.png)


The attributes you have selected as "Searchable" will be the ones which the system will use to detect possible duplicates against.  
Let us explain this with an example that demonstrates the detection of possible duplicates while enrolling a child in the Child Programme. 

1. Open the **Capture** app.
![](resources/images/duplicates-on-creation-00.png)

2. Select your organisation unit and program from the menu on the top.
![](resources/images/duplicates-on-creation-01.png)

3. Click **Create new person**
![](resources/images/duplicates-on-creation-02.png)

4. Fill in the first name in the form. **Remember, the first name we have checked as "Searchable" in the maintenance app.** 
Click **Save person**. The system will start looking for possible duplicates that match the name Sarah.
![](resources/images/duplicates-on-creation-03.png)

5. The system will automatically show a list of possible duplicates if there are any. 
![](resources/images/duplicates-on-creation-04.png)

6. You can choose to make a new enrollement by clicking **Save as new** or if you see the right person in the list - you can view the dashboard.
![](resources/images/duplicates-on-creation-05.png)

> **Tip**
>
> You can configure duplicates detection for tracked entity types the same way as we did for programs. 


### Program rules execution

In both cases of registering a tracked entity instance (with enrollment or without enrollment), the system will run program rules you have configured.
Note that rules can be configured in the maintenance app.

To see a rule being executed while enrolling a tracked entity instance you will have to take the following steps. 

1. Configure a rule in the maintenance app. For the example below we configured a rule that throws a warning when the date of birth is less than a year.

2. Open the **Capture** app.
![](resources/images/duplicates-on-creation-00.png)

3. Select your organisation unit and program from the menu on the top.
![](resources/images/program-rules-on-creation-00.png)

4. Fill in the date of birth with a value which is less than a year. In our case this is 27th of January 2021. 
![](resources/images/program-rules-on-creation-01.png)

5. You will now be able to see the warning produced by the program rule underneath the birth date field. 
![](resources/images/program-rules-on-creation-02.png)

## Re-enroll an existing tracked entity instance

When you are on the re-enroll page, the teId will be visible in the URL parameters. The attributes of the tracked entity instance will be pre-fielded with the current values. 
![](resources/images/enroll-existing-tei.png)


## Adding a relationship { #capture_add_relationship } 

Relationships can be added either during registration, editing or viewing of an event.
Currently the **Capture App** only supports *Event to Tracked Entity Instance* relationships.

1. While in an event, click **Add relationship**.

2. Select the relationship type you want to create.

You now have two options: 

- **Link to an existing Tracked Entity Instance** or 

- **Create new Tracked Entity Instance**.

![relationship options](resources/images/relationship_options.png)

### Link to an existing Tracked Entity Instance

1. Click **Link to an existing Tracked Entity Instance**.

- You will be presented with some options for searching for a **Tracked Entity Instance**.
  You have the option to select a **program**. If a **program** is selected the attributes are derived from the selected **program**.
  If no **program** is selected, only the attributes that belong to the **Tracked Entity Instance** will be visible.

    ![search for Tracked Entity Instance](resources/images/search_tei.png)

    - If the **Tracked Entity Instance** or **program** is configured with a unique attribute, this attribute can be
      used for finding a specific **Tracked Entity Instance** or **program**. This attribute should be presented alone.
      When the unique attribute field has been filled out, click the **Search** button located right below
      the unique attribute field.

    - If the **Tracked Entity Instance** or **program** has attibutes these can be used for searching by expanding the **Search by attributes** box.
      When all desired attribute fields have been filled out, click the **Search by attributes** button located at the bottom. You can also limit the search by setting the **Organisation unit scope**. If set to *All accessible* you will search for the **Tracked Entity Instance** in all organisation units you have access to. If you select *Selected*, you will be asked to select which organisation units to search within.

2. After a successful search you will be presented with a list of **Tracked Entity Instances** matching the search criteria.
   To create a relationship click the **Link** button on the **Tracked Entity Instance** you would like to create a relationship to.

- If you did not find the **Tracked Entity Instance** you were looking for, you can either click the **New search** or **Edit search** buttons.
  **New search** will take you to new blank search while **Edit search** will take you back to the search you just performed keeping the search criteria.

### Create new Tracked Entity Instance

1. Click **Create new Tracked Entity Instance**.

- You are now presented with a form for registering a new **Tracked Entity Instance**. You can choose to either register with or without a program.
  If a program is selected, the new **Tracked Entity Instance** will be enrolled in said program. You can also change the **Organisation unit** by removing the one that is automatically set and selecting a new one.

  ![register new Tracked Entity Instance](resources/images/register_tei.png)

2. Fill in the desired (and possibly mandatory) attributes and enrollment details.

3. Click **Create Tracked Entity Instance and Link**.

> **Note**
>
> When filling in data you might face a warning telling you that a possible duplicate has been found. You can click the warning to see these
> duplicates and if the duplicate is a match you can choose to link that **Tracked Entity Instance** by clicking the **Link** button.
> If the warning is still present when you are done filling in data, you will not see the **Create Tracked Entity Instance and Link** button.
> Instead you will be presented with a button called **Review duplicates**. When you click this button a list of possible duplicates will be displayed.
> If any of these duplicates matches the **Tracked Entity Instance** you are trying to create you can click the **Link** button, if not you can click
> the **Save as new person** button to register a new **Tracked Entity Instance**.


## Edit an event { #capture_edit_event } 

1. Open the **Capture** app.

2. Select a program.

3. Select an organisation unit or click the _all events_-link to view all events accessible to you.

    ![](resources/images/main-page-all-accessible-records.png)
    All events registered to the selected program show up in a list.

4. Click the event you want to modify.

5. Click the **Edit event** button.

6. Modify the event details and click **Save**.

## Delete an event { #capture_delete_event } 

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a program.

    All events registered to the selected program show up in a list.

4. Click the **triple dot** icon on the event you want to delete.

5. In the menu that is displayed click **Delete event**.

    ![delete event](resources/images/delete_event.png)

## Modify an event list layout { #capture_modify_event_list_layout } 

You can select which columns to show or hide in an event list. This can
be useful for example when you have a long list of data elements
assigned to a program stage.

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a program.

    All events registered to the selected program show up in a list.

4. Click the **gear** icon on the top right of the event list.

5. Select the columns you want to display and click **Save**.

    ![modify event list](resources/images/modify_event_list.png)

> **Tip**
>
> You can reorganize the order of the data elements by draging and dropping them in the list.

## Filter an event list { #capture_filter_event_list } 

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a program.

    All events registered to the selected program show up in a list.

    Along the top of the event list are buttons with the same names as the column headers in the list.

4. Use the buttons on the top of the list to filter based on a report date or a specific data element.

    ![filter event](resources/images/filter_event.png)

> **Note**
>
> Different data element types are fitered in different ways. A **Number** data element will for instance show a rang to filter on while a **Text** data element will ask you to enter a search query to filter on.

## Sort an event list { #capture_sort_event_list } 

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a program.
    All events registered to the selected program show up in a list.

4. Click one of the column headers to sort the list on that data element in ascending order.

    A small upward arrow is displayed next to the column to show that the list is sorted in ascending order.

5. Click the column header again to sort the list on that data element in descending order.

    A small downward arrow is displayed next to the column to show that the list is sorted in descending order.

    ![sort event](resources/images/sort_event.png)

## Download an event list { #capture_download_event_list } 

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a program.
    All events registered to the selected program show up in a list.

4. Click the **three dots** icon on the top right of the event list.

5. Click **Download data**.

6. Select the format you want to download.

    ![download event list](resources/images/download_event_list.png)

> **Note**
>
> You can download an event list in JSON or CSV formats.

## Predefined list views { #capture_views } 

You can set up your own views and save them for later use. The views can also be shared with others. A view consists of filters, column order and event sort order.

### Saving a new view { #capture_view_save } 

1. Select an organisation unit and a program.

2. Set filters using the filter buttons above the event list (described in detail [here](#capture_filter_event_list)).

    ![](resources/images/view_save_filters.png)

3. Set the column order by clicking the cog icon and then, in the pop-up, specify the layout according to your preference (how to modify the layout is described in detail [here](#capture_modify_event_list_layout)).

    ![](resources/images/view_save_column_order.png)

4. Sort the events by clicking on one of the column headers (described in detail [here](#capture_sort_event_list)).

    ![](resources/images/view_save_sort_order.png)

5. Open the more menu (three dots icon) to the right and then select "Save current view..."

    ![](resources/images/view_save_menu.png)

6. Fill in a name for the view and click save.

    ![](resources/images/view_save_name.png)

### Loading a view { #capture_view_load } 

1. Select an organisation unit and a program with a predefined view.

2. The views should be available above the event list itself. Click on a view to load it.

    ![](resources/images/view_load_unselected.png)

3. An example of a loaded view.

    ![](resources/images/view_load_selected.png)

### Updating a view { #capture_view_update } 

1. Load the view you would like to update (see [loading a view](#capture_view_load)).

2. Make your changes to filters, column order and/or event sort order.

    > **Note**
    >
    > An asterisk(*) is appended to the view name when the view has unsaved changes.

3. Open the more menu (three dots icon) to the right and then select "Update view".

    ![](resources/images/view_update.png)

### Sharing a view { #capture_view_share } 

1. Load the view you would like to share (see [loading a view](#capture_view_load)).

2. Open the more menu (three dot icon) to the right and then select "Share view..."

    ![](resources/images/view_share.png)

3. Make your changes. You would typically add users/groups (1) and/or change the access rights of users/groups added earlier (2).

    ![](resources/images/view_share_access.png)

### Deleting a view { #capture_view_delete } 

1. Load the view you would like to delete (see [loading a view](#capture_view_load)).

2. Open the more menu (three dots icon) to the right and then select "Delete view".

    ![](resources/images/view_delete.png)

## User assignment in events programs { #capture_user_assignment } 

Events can be assigned to users. This feature must be enabled per program.

### Assigning user to new events { #capture_user_assignment_new } 

1. Select an organisation unit and a program with user assignment enabled.

2. Click **New Event** in the upper right corner.

3. You will find the assignee section near the bottom of the data entry page. Search for and select the user you would like to assign the event to. The assignee will be preserved when you save the event.

    ![](resources/images/user_assignment_new.png)

    ![](resources/images/user_assignment_new_filled.png)

### Change assignee { #capture_user_assignment_edit } 

1. Select an organisation unit and a program with user assignment enabled.

2. Click an event in the list

3. In the right column you will find the assignee section.

    ![](resources/images/user_assignment_edit.png)

4. Click the **Edit** button, or the **Assign** button if the event is not currently assigned to anyone.

    ![](resources/images/user_assignment_edit_button.png)

    ![](resources/images/user_assignment_edit_add.png)

5. Search for and select the user you would like to reassign the event to. Click the **Save** button.

### Assignee in the event list { #capture_user_assignment_event_list } 

In the event list you will be able to view the assignee per event. Moreover, you can sort and filter the list by the assignee.

#### Filter by assignee

1. Click the **Assigned to** filter.

    ![](resources/images/user_assignment_event_list.png)

2. Select your preferred assignee filter and then click update.

    ![](resources/images/user_assignment_event_list_options.png)

## Tracker programs { #capture_tracker_programs } 

The Capture app supports the workinglists in tracker programs, but when you open a tracked entity instance, you will be redirected to the enrollment dashboard in the Tracker Capture app.

![](resources/images/tracker_program.png)


## Search for tracked entity instances

### In Program scope

1. Open the **Capture** app.

2. Select a program.

    You will only see programs associated with the selected organisation unit and programs you have access to, and that are shared with your user group through data level sharing.

3. Click the Search button.

4. From the dropdown menu click the first option.

    ![](resources/images/search-by-attributes-find-button.png)

    These steps will take you to the search page. There, based on the configuration of your organisation, will see the different attributes you can search with. An example of how this looks is the following.

    ![](resources/images/search-by-attributes-on-scope-program-overview-0.png)

    To execute a search now:

1. Fill in the attributes you want to search with.

2. Click the **Search by attributes** button.

    ![](resources/images/search-by-attributes-on-scope-program-overview-1.png)

3. The results of the search will be displayed as follows.

    ![](resources/images/search-by-attributes-on-scope-program-overview-2.png)

    In this list you can see the entries that match your search. For each entry you can have a total of three options.

    a. You can choose to view the dashboard for the **Tracked Entity Instance** by clicking the "View dashboard" button

    ![](resources/images/search-by-attributes-on-scope-program-overview-5.png)

    b. You can view the the active enrollment of a **Tracked Entity Instance** by clicking the "View active enrollment" button

    ![](resources/images/search-by-attributes-on-scope-program-overview-3.png)

    c. You can re-enroll a **Tracked Entity Instance** to the current program you are searching within.

    ![](resources/images/search-by-attributes-on-scope-program-overview-4.png)


#### Fallback search

Execute a full search as described above. If the search you have made has results they will be displayed. However, the actual **Tracked Entity Instance** you are searching for may be within a different program. In that case, you may want to extend the search to other programs. This is known as a fallback search.

To execute a fallback search, simply press the button on the bottom saying "Search in all programs".
You will see the **Results in all programs** be appended below the search in the current program. These two modules are collapsible to save space. 

If the fallback can not be done, you will be presented with a modal to go **Back to search** so that you can change the search terms.

> **Note**
>
> The fallback search is only possible when searching within a Program.

![](resources/images/search-by-attributes-fallback-overview-0.png)

#### Create new **Tracked entity instance**

When none of the results match, you can create a new user by clicking **Create new** button on the bottom of the search page. 

Based on the search domain, you will be navigated to the registration of the selected **Tracked entity type**, with or without program enrollment preselected. 
The search terms that you typed in before will be prefilled in the registration form.

![](resources/images/search-page-create-new-tei.png)


### In Tracked entity type scope

1. Open the **Capture** app.

2. Click the **Search** button to open the search page.

3. Click on the drop down menu and select the type of entity you want to search for.

    ![](resources/images/search-by-attributes-domain-selector-overview-0.png)

4. Make a selection from the list.

    ![](resources/images/search-by-attributes-domain-selector-overview-1.png)

    Based on the configuration of your organisation you will see the different attributes you can search with. An example of how this looks is the following.

    ![](resources/images/search-by-attributes-on-scope-tetype-overview-0.png)

    To execute a search now:

1. Fill in the attributes you want to search with.

2. Click the Search by attributes button.

    ![](resources/images/search-by-attributes-on-scope-tetype-overview-1.png)

3. The results of the search will be displayed as follows.

    ![](resources/images/search-by-attributes-on-scope-tetype-overview-2.png)

    In this list you can see the entries that match your search. For each entry you have the option to click the "View Dashboard" button to view the dashboard for the **Tracked Entity Instance**.


### Too many results functionality

The program or tracked entitiy type you are searching within may be configured with a limit on the number of results that are retrurned from a search. If your search results exceed this limit you will be shown a warning message like the one below.

![](resources/images/search-by-attributes-on-scope-program-overview-too-many-results-message.png)

### Pagination

The results page shows up to five results at a time. You should try to use specific search criteria so that there are not too many matches. However, if there are more than five results, you can see the next results by using the **>** button at the end of the page.

![](resources/images/search-by-attributes-on-scope-program-overview-pagination.png)

## List tracked entity instances enrolled in program

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a tracker program with "Display front page list" set to true.

4. The program can have categories associated with it (implementing partner would be an example of such a category). If this is the case, fill them in.

### Custom TEI working list for programs with "Display front page list" set to false.

1. Open the **Capture** app.

2. Select an organisation unit.

3. Select a tracker program with "Display front page list" set to false.

4. If the program has any custom working list you are able to click and load it.

![](resources/images/tei_list.png)

### Filter the list

Use the buttons above the list itself to filter it.

![](resources/images/tei_list_filters.png)

As an example, you could filter the list to show only tracked entity instances where you have been assigned an event: Click the "Assigned to" filter (1), select "Me" (2) and then "Apply" the changes (3).

![](resources/images/tei_list_filter_example.png)

### Sort the list

Click one of the column headers to sort the list by that column. A small arrow is displayed next to the column header to indicate the current sort order. Click again to change between ascending and descending order.

![](resources/images/tei_list_sort_order.png)

### Modify the list layout

You can select which columns to show in the list and also reorganize the order of the columns.

Click the **gear** icon in the top right corner of the list. Tick the checkboxes for the the columns you would like to display (1) and reorgainze the columns by dragging and dropping (2).

![](resources/images/tei_list_column_layout.png)

### Loading a predefined list view

You will find the predefined list views above the filters for the list. Click to load a view. 

![](resources/images/tei_list_predefined_views.png)

### Download the tracked entities list

1. Open the **Capture** app.
2. Select an organisation unit.
3. Select a tracker program with "Display front page list" set to true.
4. Click the **three dots** icon on the top right of the tracked entities list.
5. Click **Download data**.
6. Select the format you want to download.
    ![download tracked entities list](resources/images/download_tracked_entities_list.png)
> **Note**
> You can download the tracked entities list in JSON or CSV formats.

## Tracker program stage working list

You can show data elements from a single stage in a working list. Select the "Program stage" option from the "More filters" dropdown, then choose a program stage.

![](resources/images/program_stage_button.png)

![](resources/images/program_stage_working_list.png)

The tracker program stage list can be [filtered](#filter-the-list), [sorted](#sort-the-list), [modified](#modify-the-list-layout), [saved](#capture_view_save), [updated](#capture_view_update), [deleted](#capture_view_delete) and [shared](#capture_view_share) in the same way as other working lists.

## Implementer / administrator info { #implementer_info } 

### Metadata caching { #metadata_caching } 

For performance reasons the Capture app caches metadata in the client browser. When metadata is updated on the server the changes needs to be propagated to the clients that have already cached the metadata. Depending on the change, this is done in one of three ways:

1. If the change is bound to a program you will need to increase the program version for that particular program. For example, if you change the data elements in a program or a program rule, the version for the bound program needs be increased.

2. If the change is NOT bound to a program you will need to increase ANY program version for the change to be propagated to the clients. Examples here are changes to constants, organisation unit levels or organisation unit groups.

3. The exception to the two rules above is option sets. Option sets have their own version property, i.e. increasing the option set version should ensure the option set metadata are propagated to the clients.


## Enrollment dashboard

### Enabling the enrollment dashboard

#### Opt in

Enable the enrollment dashboard for a Tracker program for all the users. The dialog is visible for users with program write access. 

![](resources/images/enrollment-dash-opt-in.png)

#### Opt out

Disable the enrollment dashboard for a Tracker program for all the users.

![](resources/images/enrollment-dash-opt-out.png)

### Reaching the enrollment dashboard via url

You reach the enrollment dashboard either by typing in the address bar of your browser or using the user interface of the capture app.
In this section we are focusing on the first use-case, where you type or paste the url you want to access in the Address bar.

![](resources/images/enrollment-dash-01.png)

One way to reach the enrollment dashboard and view a specific tracked entity instance's enrollment is by using _only_ the enrollment id. For example the link .../dhis-web-capture/#/enrollment?enrollmentId=wBU0RAsYjKE will 
take you the dashboard for the enrollment with id `wBU0RAsYjKE`. 

The top of the dashboard defines your context. For example in the image below the context is as follows, the selected program is "Child Programme", the organisation unit is "Ngelehun CHC", the selected person is "Anna Jones" and the selected enrollment is "2017-11-16 11:38".

![](resources/images/enrollment-dash-02.png)

You can change your context by clicking the "x" button.

![](resources/images/enrollment-dash-03.png)

#### Deselecting the program

When you deselect the program you see the following

![](resources/images/enrollment-dash-05.png)

##### Selecting a program with enrollments

When program _and_ enrollment selections are empty, you first have to select a program. 
If the tracked entity instance (in this case "Anna Jones") has enrollments under the program you select you will see the following message.

![](resources/images/enrollment-dash-09.png)

##### Selecting a program with zero enrollments

If the tracked entity instance (in this case "Anna Jenkins") does not have enrollments under the program you select you will see a message explaining that there are no enrollments for that program.
You will also be given the option to enroll "Anna Jenkins" in that program.

![](resources/images/enrollment-dash-10.png)

##### Selecting an event program 

When you select an event program you will see the following. (Remember event programs do not have enrollments in the system, only tracker programs do).

![](resources/images/enrollment-dash-11.png)

You will also be given the option to either create a new event for the selected program or view the working lists for the selected program.

##### Selecting a program with a different tracked entity type 

When your selected tracked entity type is a person, as in our example with Anna Jenkins, and you select a program that is not of type person but for example of a type Malaria case you will see the following.

![](resources/images/enrollment-dash-12.png)

You are also given the option to enroll a tracked entity instance in the program you selected.

#### Deselecting the organisation unit

When you deselect the organisation unit you see the following

![](resources/images/enrollment-dash-06.png)

#### Deselecting the tracked entity instance

When you deselect the tracked entity instance, in this case "Anna Jones" you are taken to the working lists in that Tracker program.

![](resources/images/enrollment-dash-07.png)

#### Deselecting the enrollment

When you deselect the enrollment you see the following

![](resources/images/enrollment-dash-08.png)


###Quick actions

The quick actions widget offers shortcuts for frequently used actions for the current enrollment.

![](resources/images/enrollment-dashboard-quick-actions.png)

### Program stage list

Stages can be collapsed or expanded to reveal the events inside.

![](resources/images/enrollment-dash-stages-events-02.png)

#### Collapsed stages

![](resources/images/enrollment-dash-stages-events-01.png)

In the collapsed state, you can view the summary information about this stage including: 
- Icon
- Program stage name
- Program stage description (on hovering the information icon)
- Total number of events
- Last updated date 
Depending on the status of events, there can be additional information regarding: total number of overdue events or total number of scheduled events.

#### Expanded stages

![](resources/images/enrollment-dash-stages-events-03.png)

When you expand the list, you will see the table contains the data of events in the stage. This includes mandatory columns: `Status`, `Report date` and `Organization unit`, the following columns depend on the data elements that have been selected as `Display in list`  of event.

Events are sorted with most recent on top and other columns are also sortable.

![](resources/images/enrollment-dash-stages-events-04.png)

When clicking  **New {stage event name}** button, you will be redirected to the  **Add new event page** for this selected stage.

![](resources/images/enrollment-dash-stages-events-06.png)


When clicking  **Go to full {stage event name}** button, you will be redirected to the  **Program stage list page** for this selected stage.

![](resources/images/enrollment-dash-stages-events-08.png)

#### Expanded stages with more than 5 events 

In case there are more than 5 events in the list, only the first 5 are shown. You will be able to view the rest by clicking  **Show more**.

![](resources/images/enrollment-dash-stages-events-05.png)

If you want to collapse events, you can use  **Reset list** button which will return the table back to the default sorting and initial 5 events.

![](resources/images/enrollment-dash-stages-events-07.png)

### Enrollment widget

On the enrollment page you can see the enrollment widget

![](resources/images/enrollment-dash-enrollment-widget-1.png)

#### Enrollment actions

When you click on the enrollment actions button, a menu with all the available actions will open. You can:

- Change the enrollment status to Active, Canceled or Completed using the buttons in the menu.
- Mark or remove the enrollment for a follow-up.
- Transfer the enrollment to another organisation unit
- Delete the enrollment
- Add coordinates to the enrollment

![](resources/images/enrollment-dash-enrollment-widget-2.png)

There can only be one active enrollment at a time. If there are no active enrollments, there will be a button **Add new** to enroll the tracked entity instance in the program again.
If the program only allows one enrollment per tracked entity instance, the **Add new** button will be disabled with a tooltip saying `Only one enrollment per {TET} is allowed in this program`.

![](resources/images/enrollment-dash-enrollment-widget-add-new.png)

#### Transfer the enrollment to another organisation unit

In the enrollment actions, you could also choose to transfer the enrollment to another organisation unit. Click the transfer button and select the organisation unit you want to transfer the enrollment to.

![](resources/images/enrollment-dash-enrollment-widget-transfer.png)

#### Delete the enrollment

You can delete the enrollment by clicking the delete button and confirming the action in the modal. 

![](resources/images/enrollment-dash-enrollment-widget-3.png)

#### Complete the enrollment

You can complete the enrollment by clicking the complete button. When there are active events, you can choose to complete the enrollment along with the events from the confirmation modal.

![](resources/images/enrollment-dash-enrollment-widget-4.png)

### Enrollment note widget

The enrollment note widget displays notes and allows addition of notes, associated with the current enrollment. 

![](resources/images/enrollment-widget-note.png)

By clicking in the text field, you will be able to enter new text and see action buttons **Save note** and **Cancel**. Be aware that Enrollment notes are attributed to a user and cannot be deleted. 


### Relationship widget

The Relationships widget on the enrollment dashboard is used for viewing the record’s linked relationships to other records.
The number next to the title signifies the total number of relationships

![](resources/images/enrollment-dash-relationship-widget.png)

For tracked entity instance relationships, the key attributes shown in the widget are the attributes that have been selected to be displayed on the relationship type page in Maintenance.

If no attributes are selected, it will just show a row per record with tracked entity type name and relationship creation date.

When clicking a tracked entity instance you should be taken to the Enrollment Dashboard. If the relationship type includes a program, you should be taken to the latest enrollment for that program. If no program is specified, you should still be sent to the enrollment dashboard, but without a program.

Click the **Add new** button to add a new relationship. Adding a new relationship opens a dialog where you can select the applicable relationship type.

![](resources/images/enrollment-dash-relationship-widget-add.png)

Choose between linking to an existing tracked entity instance or creating a new one.

![](resources/images/enrollment-dash-relationship-widget-add-choose.png)

#### Existing tracked entity instance

Use the search form to find any existing record to link to.

![](resources/images/enrollment-dash-relationship-widget-add-existing.png)

#### New tracked entity instance

Use the form to create a new record and link.

![](resources/images/enrollment-dash-relationship-widget-add-new.png)

### Tracked entity instance profile widget

On the enrollment dashboard, you can view the tracked entity instance profile widget. Inside the profile widget you can view the key attributes values. 

![](resources/images/enrollment-dash-tei-profile-widget.png)

Click the **Edit** button to make changes to the tracked entity instance profile. Editing the profile opens a dialog where the profile attributes can be changed.

![](resources/images/enrollment-dash-tei-profile-widget-edit.png)

Click the **Delete ${tracked entity type}** button to delete the tracked entity. You can confirm the action from the dialog. Once confirmed, tracked entity and all its associated enrollment and events across all programs will be deleted. To delete a tracked entity that has any enrollments, the user needs the authority **Delete tracked entity instance and associated enrollments and events**.

![](resources/images/enrollment-dash-tei-profile-widget-delete.png)

### Feedback widget

![](resources/images/enrollment-dash-feedback-widget-1.png)

On the enrollment dashboard, the feedback widget displays text and values that are triggered by certain conditions. 
If the current dashboard triggers some rules set up in the program, the text or values will be automatically displayed.

#### Empty state

If there isn't any feedback for the current dashboard, the widget shows a short _empty_ message.
If there aren't any program rules that could show feedback for the current dashboard then the widget is hidden.


### Indicator widget

![](resources/images/enrollment-dash-indicator-widget-1.png)

On the enrollment dashboard, the indicator widget displays indicator text and values output related to the current dashboard.
The indicators will be sorted alphabetically.

#### Empty state

If there aren't any related indicators or indicator output for the current dashboard, the widget shows a short _empty_ message.
If the current dashboard can't show any indicator output (because it has no related indicators) then the widget is hidden.

#### Legends

Some indicator values show a colored circle next to the value. 
The colored circle shows the related legend color for that indicator value. 
Colored legend circles are only shown for indicator values that have them set up.


### Warning widget

![](resources/images/enrollment-dash-warning-widget-1.png)

On the enrollment dashboard, the warning widget displays warnings related to the current dashboard. The widget shows warnings that are not associated with any specific data item.
If there aren't any warnings to show for the current dashboard then the widget is hidden.

### Error Widget

![](resources/images/enrollment-dash-error-widget-1.png)

On the enrollment dashboard, the errors widget displays errors related to the current dashboard. The widget shows errors that are not associated with any specific data item.
If there aren't any errors to show for the current dashboard then the widget is hidden.

## Enrollment event view and edit page

### Navigation 

You can reach the enrollment event edit page is by clicking any event in the Program stage list from the Enrollment Overview page.

### Top bar context 

At the top of the page you can see various information related to the current context. You can see the program, the organization unit, the tracked entity, the enrollment date, the stage and the enrollment event date.

To go to Enrollment Overview page you can:
- click the "Back to all stages and events" button.
- deselect the stage from the top bar.
- deselect the event from the top bar.

![](resources/images/enrollment-event-view-edit-navigation.png)

### View/Edit event form 

This is the form where you can see and edit the enrollment event details.

#### Form header 

In the view/edit event form you can see the stage name and icon.

![](resources/images/enrollment-event-view-edit-header.png)

### Top bar context  

At the top of the page you can see different informations related with the current context. You can see the program, the organization unit, the tracked entity, the enrollment date, the stage. 

To go to Enrollment Overview page you can: 
- deselect the stage from the top bar. 
- deselect the event from the top bar. 

![](resources/images/enrollment-event-new-navigation.png) 


### Scheduled date in edit event form
If an event has the status Scheduled or Overdue, you will be able to see the **Report** and **Schedule** tab. 

![](resources/images/enrollment-edit-event-schedule-date-1.png)


In the **Report** tab, the scheduled date field will still be shown, but will be greyed out, and there will be an icon next to it with a tooltip saying “Go to **Schedule** tab to reschedule this event”.

In the **Schedule** tab, the similar information about scheduling an event as in New event workspace will be shown. You will be able to edit the schedule date and save the change by clicking **Schedule** button.

![](resources/images/enrollment-edit-event-schedule-date.png)

If an active event has a scheduled date before becoming active or a completed event has scheduled date, this date should still be shown in the workspace. 
It’ll be locked with an icon next to it and a tooltip saying “Scheduled date cannot be changed for active/completed events”. 

#### Scheduled date with Hide due date enabled
If the flag “Hide due date” in the Maintenance configuration is enabled, scheduled date will not be shown in the form. 

However, you can still schedule an event, but it automatically chooses the date based on "Scheduled days from start" that has been configured in Maintenance, and this can not be changed. 
In the **Schedule** tab, there will be “Schedule info” saying “Scheduled automatically for xx/xx/xx”, and the user can click  **Schedule** button.

### Ask user to complete program when stage is complete
If this flag has been enabled for the stage in Stage details in Maintenance, a modal will show up after the user checks the **Complete** event checkbox and clicks save.

![](resources/images/ask-user-to-complete-enrollment-edit-event.png)

#### View mode

When the form is in the view mode the title of the page will appear as: `Enrollment: View Event`. You can see in the page all the information related to the event. Click the `Edit event` button to switch to the edit mode. 
This mode is bypassed for events that are scheduled.

![](resources/images/enrollment-event-view-edit-view.png)

#### Edit mode

When the form is in the edit mode the title of the page will appear as: `Enrollment: Edit Event`. You can modify the event and click the `Save` button. Click the `Cancel` button to switch to the view mode without saving the changes.
Scheduled events are are the exception and they are opened in edit mode directly, without the user having to click `Edit event`. Click the `Cancel` button to go back to the enrollment dashboard page without saving the changes.

![](resources/images/enrollment-event-view-edit-edit.png)

In this form you can also delete the event by clicking `Delete` button, a modal will appear to confirm if you want to delete this event. You will then be navigated back to Enrollment dashboard page.

![](resources/images/enrollment-edit-event-delete.png)

#### Widgets in View/Edit event page

The widgets seen in the right-hand column will display and function the same way as mentioned in the [enrollment dashboard](#enrollment-dashboard).

##### Widget assignee
1. In View/Edit enrollment event page

2. In the right column you will find the assignee widget.

    ![](resources/images/user_assignment_edit_enrollment.png)

3. Click the **Edit** button, or the **Assign** button if the event is not currently assigned to anyone.

    ![](resources/images/user_assignment_edit_button.png)

    ![](resources/images/user_assignment_edit_add.png)

4. Search for and select the user you would like to reassign the event to. Click the **Save** button.

![](resources/images/enrollment-event-view-edit-widgets.png)

## Enrollment event new page

You can reach this page add event page by clicking in the **New {stage event name}** button in the overview page. 
In this page you can switch between different tabs: **Report** to add new event, **Schedule** to schedule an event and **Refer** to refer event.
If you have unsaved changes in one tab and switch to another tab, there will be a warning displayed.

### New event widget form

This is the form where you can modify the event details before saving. In the header you can see the stage name and icon.

![](resources/images/new-event-widget-form-header.png)

### New event page without a stage

If you enter the new event page with no stage selected, a list of available stages will be displayed.
Select the stage you want to add a new event in by clicking the associated button.
To navigate back to the enrollment overview, click the **Cancel without saving**-button

![](resources/images/enrollment-event-new-stage-selection-list.png)

### Ask user to complete program when stage is complete
If this flag has been enabled for the stage in Stage details in Maintenance, a modal will show up after the user clicks the **Complete** button.

![](resources/images/ask-user-to-complete-enrollment-new-event.png)

### Ask user to create new event when stage is complete
If this flag has been enabled for the stage in Stage details in Maintenance, a modal will show up after the user clicks the **Complete** button or checks the **Complete** event checkbox and clicks save. The user can choose the button **Yes, create new event** to navigate to the New Event page or **No, cancel** to navigate back to the enrollment dashboard. If there is only one possible stage available, the user will be taken directly to the New event workspace for that stage.


### Assigning user to new events
When reporting or scheduling an event, you can assign a user to it. This feature must be enabled per program stage in a tracker program by clicking the "Allow user assignment of events" check box.

You will find the assignee section near the bottom of the data entry page. Search for and select the user you would like to assign the event to. The assignee will be preserved when you save the event.

![](resources/images/user_assignment_report_new.png)

![](resources/images/user_assignment_schedule_new_filled.png)

### Schedule event widget form
Instead of reporting an event the user can select to schedule an event for later. The form will open with a suggested scheduled date. This date is determined by a set of rules as explained below.

The suggested date for the first event of a program stage in an enrollment is always based on the enrollment date or the incident date (depending on the program configuration). The program stage configuration setting "scheduled days from start" will be added to the base date to cumpute the suggested date.

#### 1. **Default next scheduled date**
If a program stage has a default next scheduled date configured, the suggested date is the most recent next scheduled date. Below is an example of how this can work.
>
1. A data element with value type date needs to be created and assigned to the particular program stage with access to future dates. The name of the data element could for example be: Next suggested follow up date. The program stage is configured to use the data element as default when scheduling a new event by assigning the data element to default next scheduled date.

![](resources/images/schedule_event_01.png)

2. A program rule based on the data entered in the program stage, will determine how many days until the next suggested follow up will be. For example: A program rule with the following condition: #{penta_dose} == '1' (The program rule will trigger when the TEI has received Penta Dose 1), Assign value to the data element: next suggested follow up date with expression: d2:addDays(V{event_date}, '30') **The number suggest how many days from event date the next scheduled event should be.** 

3. Open the Capture app and create a TEI. As long as Penta Dose has value Dose 1, the suggested next scheduled event is 30 days forward from event date. When scheduling a new event, the system will pick up from the data element as long it has value.

![](resources/images/schedule_event_02.png)

![](resources/images/schedule_event_03.png)

![](resources/images/schedule_event_04.png)

User can also find more information about how many events that scheduled on the same selected date or the interval of selected date and the suggested date from the information box.

Below the schedule date entry, user can choose to add a note to the scheduled event.

After clicking **Schedule** button, user will be navigated back to enrollment overview page.

#### 2. **Standard interval days** 

1. If the program stage has standard interval days configured, the suggested date is calculated by the most recent event date plus the standard interval days value. 

![](resources/images/standard_interval_days_01.png)

2. If the program stage do not have a default next scheduled date configured, the system will use the standard interval days to calculate the next scheduled event date. 

![](resources/images/standard_interval_days_02.png)


#### 3. **If no value is found on either, the suggested date will be defined by enrollment date and incident date.** 

1. In case the option **Generate events based on enrollment date** is checked in the Maintenance app, the next suggested event date is calculated by the enrollment date plus the value of scheduled days from start. 

![](resources/images/schedule_event_from_enrollmentdate_01.png)

2. In case the option **Show incident date** is checked, the next suggested event date is calculated by the incident date plus the value of scheduled days from start.

![](resources/images/schedule_event_from_incidentdate_01.png)

## Program stage event list 

You can reach the program stage event list by clicking **Go to full {stage event name}** button in the overview page.

### Stage Event list 

In this view you can see all events in a stage 

#### Stage Event list header

In the header, you can see the stage name and icon 

![](resources/images/program-stage-event-list-header.png)

## Attribute option combo for Tracker

You can add segregation to your Tracker event data using attribute option combos. To get started, add a category combination to your Tracker program configuration.

The attribute option combo selector will be displayed when you are adding or changing/viewing Tracker events. Additionally, the selector will be displayed when enrolling if events are being auto-generated as part of the enrollment process.

Example from new Tracker event:

![](resources/images/attribute-option-combo-tracker.png)
