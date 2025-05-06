# Change Log Inventory for PillPal

# What We Created

\* Note: A changelog going over the development of the project is located in the project folder called CHANGELOG.md

## Login/Signup:

**Auth.js** \- Page where users can login, or signup if they do not already have an account. The page is for both providers and patients alike, and adapts to their respective needs.

### Styling

* **Auth.css**

## Provider Side:

**ProviderNavbar.js** \- Allows the provider to hide/display the navigation pane. Gives the provider an outlet to logout.  
**ProviderNavbarData.js** \- Contains content for the provider to navigate between pages  
**ProviderDashboard.js** \- Page where provider can view all of their patients and request access to existing patients not currently under their care  
**ProviderNotes.js** \- Page where the provider can write a note to one of their patients  
**ProviderProfile.js** \- Page where the provider can view their own profile  
**PatientDetails.js** \- Page where the provider can view the details of one of their patients

### Styling

* **ProviderDashboard.css**  
* **ProviderNavbar.css**  
* **ProviderNotes.css**  
* **ProviderProfile.css**  
* **Bootstraps**

## Patient Side:

**Navbar.js** \- Allows the patient to hide/display the navigation pane. Gives the provider an outlet to logout, and view their notifications about providers requesting access.  
**NavbarData.js** \- Contains content for the patient to navigate between pages  
**Dashboard.js** \- Page where the patient can view their medication stack. The patient can select a day and it displays all the details for the medications they are supposed to be taking that day. The patient can also view their pinned doctor’s notes.  
**DoctorsNotes.js** \- Page where the patient can view all the notes that their providers have sent them. The patient can pin/unpin them as well as delete them.  
**MedicalProviders.js** \- Page where the patient can view their providers. The patient can add/remove providers.  
**Profile.js** \- Page where the patient can view their own profile

### Styling

* **Dashboard1.css**  
* **DoctorsNotes.css**  
* **Profile.css**  
* **Navbar.css**  
* **Bootstraps**

## Middleware:

**MedicationStack.js** \- Page where a patient can add/remove medication for themselves, and where a provider can add/remove medication for one of their patients.   
**useDrugInteractions.js** \- Handles checking if two medications have an existing conflict.

### Rest APIs

**activitylogger.js** \- APIs to log sensitive actions that could be subject to review  
**auth.js** \- APIs to authenticate and register users  
**dashboard.js** \- APIs to manage a patients dashboard  
**index.js** \- routing for the APIs  
**medications.js** \- APIs to get medication information, add/remove medication, and check interactions between medications  
**patients.js** \- APIs to get information about patients and manage their account  
**providers.js** \- APIs to get information about providers, manage their account, and send patients notes

### Styling

* **MedicationStack.css**

## Other:

**App.js** \- Base app containing routes to everything we developed  
**App.test.js**  
**portScanner.js**  
**reportWebVitals.js**  
**server.js**  
**setupTests.js**  
**testConnection.js**  
**.env**  
**package.json**  
**package-lock.json**  
Using Figma, Peyton and Max created the logo for our website (**logo.svg**).

### Styling

* **App.css**  
* **index.css**  
* 

# Open Source Changes

Although we used existing packages, we did not modify any existing code to repurpose it for our project.  
