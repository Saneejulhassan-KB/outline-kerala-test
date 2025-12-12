import { gql } from "@apollo/client";

export const GET_WARDS_DATA = gql`
  query {
    wards {
      wardNumber
      wardName
      totalVoters
      candidates {
        id
        name
        party
        voteCount
        partyLogo
        candidatePhoto
      }
    }
  }
`;