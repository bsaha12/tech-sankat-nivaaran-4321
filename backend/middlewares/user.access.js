const access = (permittedRoles) => {
        return (req, res, next) => {
                const userrole = req.body.role
                if (permittedRoles.includes(userrole)) {
                        next();
                } else {
                        res.status(500).json({ error: "Internal server error: Invalid roles configuration." });
                }
        };
};

module.exports = {
        access
};
