// Source: https://stackoverflow.com/questions/8064691/how-do-i-pass-along-variables-with-xmlhttprequest
function formatParams(params) {
    return Object
      .keys(params)
      .map(function(key) {
        return key+'='+encodeURIComponent(params[key])
      })
      .join('&');
  }
  
  // params is given as a JSON
  export function get(endpoint, params, successCallback, failureCallback, header) {
    const xhr = new XMLHttpRequest();
    const fullPath = endpoint + (params!==null ? '?' + formatParams(params) : '')
    xhr.open('GET', fullPath, true);
    if (header){
      header.map( (valueArray) => {
        xhr.setRequestHeader(valueArray[0], valueArray[1]);
      })
    }
    xhr.onload = function(err) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (successCallback)
            successCallback(JSON.parse(xhr.responseText));
        } else {
          if (failureCallback)
          failureCallback(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(err) {
      failureCallback(xhr.statusText);
    }
    xhr.send(null);
  }
  
  export function post(endpoint, params, successCallback, failureCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-type', 'application/json');   
    xhr.withCredentials = true;
    xhr.onload = function(err) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (successCallback)
            successCallback(JSON.parse(xhr.responseText));
        } else {
          if (failureCallback)
            failureCallback(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(err) {
      reject(xhr.statusText);
    };
    xhr.send(JSON.stringify(params));
  }
  // params is given as a JSON
    export function get2(endpoint, params, headers) {
      const fullPath = endpoint + (params!==null ? '?' + formatParams(params) : '');
      return fetch(fullPath, {headers: headers}).then(res => res.json());
    }

    //make sure headers includes 'Content-type': 'application/json'
    export function post2(endpoint, params, headers) {
      return fetch(endpoint, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
      }).then(res => res.json());
    }

  