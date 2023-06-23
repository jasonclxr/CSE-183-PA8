import React from 'react';
import Context from './Context';
import {getItems, getRootInfo} from '../Fetch';

const winDims = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

/**
 * @param {object} props
 * @return {object} JSX
 */
function Provider(props) {
  const numberregex = new RegExp(['^\\s*(?:\\+?(\\d{1,3})',
    ')?[-. (]*(\\d{3})[-. )]*',
    '(\\d{3})[-. ]*(\\d{4})',
    '(?: *x(\\d+))?\\s*$'].join(''));
  const emailregex = new RegExp(['^(([^<>()[\\]\\\\',
    '.,;:\\s@"]+(\\.[^<>()[\\]',
    '\\\\.,;:\\s@"]+)*)|(".+"',
    '))@((\\[[0-9]{1,3}\\.[0-9]',
    '{1,3}\\.[0-9]{1,3}\\.[0-9]',
    '{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+',
    '[a-zA-Z]{2,}))$'].join(''));
  const [global, setGlobal] = React.useState({
    'booted': false,
    'dimensions': winDims(),
    'first': '',
    'last': '',
    'email': '',
    'phone': '',
    'emptyfirst': false,
    'emptylast': false,
    'emptypassword': false,
    'invalidemail': false,
    'invalidphone': false,
    'alreadyused': false,
    'Userinfo': '',
    'Password': '',
    'FailedLogin': false,
    'Validinfo': true,

    // data that gets fetched
    'rootCategories': [],
    'subCategories': [],
    'filters': [],
    'listings': [],

    // user navigation
    'viewFilters': false,
    'loginPage': false,
    'registerPage': false,
    'viewCats': false,
    'viewError': false,

    // user interactions
    'recentSearches': [],
    'openFilters': {},
    'selectedRootCat': '',
    'selectedSubCats': [],
    'itemBeingViewed': null,
    'selectedFilters': {},
    'selectedMobileFilters': {},
    'searchInput': '',

    // getting replies
    'currentReplies': [],
    'messageButton': false,

    // posting listings
    'postlisting': false,
    'name': '',
    'price': '',
    'description': '',
    'category': '',
    'kids': [],
    'childcategory': '',
    'Year': 0,
    'Buying Options': '',
    'Beds': 0,
    'Baths': 0,
    'Color': '',
    'Body Style': '',
    'emptyname': false,
    'emptyprice': false,
    'emptydescription': false,
    'emptycategory': false,
    'total': 1,
    'image1': '',
    'image2': '',
    'image3': '',
    'image4': '',
    'image5': '',
    'image6': '',
    'image7': '',
    'image8': '',
    'image9': '',
    'image10': '',
    'imageerror': false,
    'optionalfilts': {},
  });

  React.useEffect(() => {
    let isMounted = true;
    const handleStartUp = async () => {
      const rootInfo = await getRootInfo();
      const items = await getItems(global);
      if (rootInfo !== 404 && items !== 404 && isMounted) {
        setGlobal({
          ...global,
          rootCategories: rootInfo.subcategories,
          subCategories: rootInfo.subcategories,
          filters: rootInfo.filters,
          listings: items,
          booted: true,
        });
      }
    };
    if (!global.booted) {
      handleStartUp();
    }
    const handleResize = () => {
      setGlobal({...global, dimensions: winDims()});
    };
    window.addEventListener('resize', handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  });
  return (
    <Context.Provider value={{
      ...global,
      setUserinfo: (incoming) => {
        setGlobal({...global, Userinfo: incoming});
      },
      setPassword: (pw) => {
        setGlobal({...global, Password: pw});
      },
      setfirstname: (name) => {
        setGlobal({...global, first: name});
      },
      setlastname: (name) => {
        setGlobal({...global, last: name});
      },
      setemail: (mail) => {
        setGlobal({...global, email: mail});
      },
      setphone: (tele) => {
        setGlobal({...global, phone: tele});
      },
      successfulAccountCreation: () => {
        setGlobal({...global, registerPage: false, first: '', last: '',
          email: '', phone: '', Password: '', emptyfirst: false,
          emptylast: false, emptypassword: false, invalidemail: false,
          invalidphone: false, alreadyused: false});
        // console.log('logging on');
      },
      setFailedLogin: (attempt) => {
        setGlobal({...global, Validinfo: true, FailedLogin: attempt,
          loginPage: true});
        // console.log('logging on');
      },
      setvalidinfo: (valid) => {
        setGlobal({...global, loginPage: true, Validinfo: valid});
      },
      setFailedRegister: () => {
        setGlobal({...global, emptyfirst: false, emptylast: false,
          emptypassword: false, invalidemail: false, invalidphone: false,
          alreadyused: true});
        // console.log('logging on');
      },
      setFailedRegisterFormat: () => {
        setGlobal({...global, emptyfirst: !Boolean(global.first.length),
          emptylast: !Boolean(global.last.length),
          emptypassword: !Boolean(global.Password.length),
          invalidemail: !emailregex.test(global.email),
          invalidphone: !numberregex.test(global.phone)});
        // console.log('logging on');
      },
      toggleLogin: (open) => {
        setGlobal({...global, loginPage: open,
          Validinfo: true, FailedLogin: false, Userinfo: '', Password: ''});
      },
      loginsuccessful: () => {
        setGlobal({...global, loginPage: false,
          Validinfo: true, FailedLogin: false, Userinfo: '', Password: ''});
      },
      toggleRegister: (open) => {
        setGlobal({...global, loginPage: !open, registerPage: open,
          Validinfo: true, FailedLogin: false, Userinfo: '', first: '',
          last: '', email: '', phone: '', Password: '', emptyfirst: false,
          emptylast: false, emptypassword: false, invalidemail: false,
          invalidphone: false, alreadyused: false,
        });
      },
      toggleCats: (open) => {
        setGlobal({...global, viewCats: open});
      },
      toggleFilters: (open) => {
        setGlobal({...global, viewFilters: open});
      },
      setViewItem: (view) => {
        setGlobal({...global, itemBeingViewed: view});
      },
      noMessage: (view, value) => {
        setGlobal({...global, itemBeingViewed: view, messageButton: value});
      },
      setCurrentReplies: (replies) => {
        setGlobal({...global,
          currentReplies: replies});
      },
      setMessageButton: (value, replies) => {
        setGlobal({...global, messageButton: value, currentReplies: replies});
      },
      isDesktop() {
        return this.dimensions.width > 900;
      },
      handleOpenFilter: (name) => {
        setGlobal({
          ...global,
          openFilters: {
            ...global.openFilters,
            [name]: !global.openFilters[name],
          },
        });
      },
      handleSelectedFilter: (name, filter, type, value) => {
        const get = global.viewFilters ? 'selectedMobileFilters' :
          'selectedFilters';
        const past = global[get][filter] || {};
        let newpast = past;
        if (type !== 'minMax') {
          value = !past[name];
        }
        if (type === 'oneOf') {
          newpast = {};
        }
        const newContext = {
          ...global,
          [get]: {
            ...global[get],
            [filter]: {
              ...newpast,
              [name]: value,
            },
          },
        };
        return newContext;
      },
      setState: (attr) => {
        setGlobal({...global, ...attr});
      },
    }}>
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
