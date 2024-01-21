// const baseURL = `http://localhost:8080/`



document.addEventListener("DOMContentLoaded", function () {
    fetch(`${baseURL}analysis/stats`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('totaladministrators').textContent = data.totaladmistrator;
        document.getElementById('totalSuper').textContent = data.totalsuperadmin;
        document.getElementById('totalAdmins').textContent = data.totalAdmins;
        document.getElementById('totalDrivers').textContent = data.totalDrivers;
        document.getElementById('totalUsers').textContent = data.totalUsers;
        
        const totaladministrators = data.totaladmistrator;
        const totalSuper = data.totalsuperadmin;
        const totalAdmins = data.totalAdmins; 
        const totalUsers = data.totalUsers;
        const totalDrivers = data.totalDrivers;
  
        const setProgress = (elementId, percentage) => {
            document.getElementById(elementId).style.background = `conic-gradient(#ad9551 ${percentage}%, transparent ${percentage}%)`;
          };
  
        const administratorsPercentage = (totaladministrators / 100) * 360;
        const superPercentage = (totalSuper / 100) * 360;
  
        const adminsPercentage = (totalAdmins / 100) * 360;
        const usersPercentage = (totalUsers / 100) * 360;
        const driversPercentage = (totalDrivers / 100) * 360;
  
        setProgress('administatorProgress', administratorsPercentage);
        setProgress('superProgress', superPercentage);
        setProgress('adminProgress', adminsPercentage);
        setProgress('driversProgress', driversPercentage);
        setProgress('usersProgress', usersPercentage);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });
  
  