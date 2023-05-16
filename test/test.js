// Import the contract artifacts
const Election = artifacts.require("Election");

contract("Election", accounts => {
    let election;

    // Deploy a new contract instance before each test
    before(async () => {
        election = await Election.new();
    });

    it("should set the election details correctly", async () => {
        const adminName = "Yanuarso";
        const adminEmail = "19102124@mail.com";
        const adminTitle = "Admin";
        const electionTitle = "Calon Kandidat Presiden Favorit";
        const organizationTitle = "PolyVote";

        await election.setElectionDetails(
            adminName,
            adminEmail,
            adminTitle,
            electionTitle,
            organizationTitle,
            { from: accounts[0] }
        );

        const returnedAdminName = await election.getAdminName();
        const returnedAdminEmail = await election.getAdminEmail();
        const returnedAdminTitle = await election.getAdminTitle();
        const returnedElectionTitle = await election.getElectionTitle();
        const returnedOrganizationTitle = await election.getOrganizationTitle();

        assert.equal(returnedAdminName, adminName, "Admin name was not set correctly");
        assert.equal(returnedAdminEmail, adminEmail, "Admin email was not set correctly");
        assert.equal(returnedAdminTitle, adminTitle, "Admin title was not set correctly");
        assert.equal(returnedElectionTitle, electionTitle, "Election title was not set correctly");
        assert.equal(returnedOrganizationTitle, organizationTitle, "Organization title was not set correctly");
    });

    it("should allow the admin to add candidates", async () => {
        // Add a new candidate
        await election.addCandidate("Ganjar Pranowo", "Tuanku Rakyat");
        // await election.addCandidate("Prabowo Subianto", "Make Indonesia Great Again");
        // await election.addCandidate("Anies Baswedan", "Sukses Jakarta untuk Indonesia");

        // Get the candidate count
        const candidateCount = await election.getTotalCandidate();

        // Verify that the candidate count has increased
        assert.equal(candidateCount, 1, "Candidate was not added.");
    });

    it("should allow voters to register", async () => {
        // Register a new voter
        await election.registerAsVoter("Alice", "123-456-7890", { from: accounts[1] });

        // Get the voter count
        const voterCount = await election.getTotalVoter();

        // Verify that the voter count has increased
        assert.equal(voterCount, 1, "Voter was not registered.");
    });

    it("should allow the admin to verify voters", async () => {
        // Register a new voter
        await election.registerAsVoter("Alice", "123-456-7890", { from: accounts[1] });

        // Verify the voter
        await election.verifyVoter(true, accounts[1]);

        // Check that the voter was verified
        const voter = await election.voterDetails(accounts[1]);
        assert.isTrue(voter.isVerified, "Voter was not verified.");
    });

    it("should allow voters to vote", async () => {
        // Add a candidate
        // await election.addCandidate("Candidate 1", "Vote for me!");

        // Register a new voter
        await election.registerAsVoter("Joko", "123-456-7890", { from: accounts[2] });

        // Verify the voter
        await election.verifyVoter(true, accounts[2]);

        // Have the voter cast a vote for the candidate
        await election.vote(0, { from: accounts[1] });

        // Check that the vote was counted
        const candidate = await election.candidateDetails(0);
        assert.equal(candidate.voteCount, 1, "Vote was not counted.");
    });
});
