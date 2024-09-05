import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Option "mo:base/Option";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayersEntries : [(Text, TaxPayer)] = [];

  // Create a HashMap to store TaxPayer records
  var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

  // Initialize the HashMap with stable data
  system func preupgrade() {
    taxPayersEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayersEntries.vals(), 0, Text.equal, Text.hash);
  };

  // Create a new TaxPayer record
  public func createTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async () {
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(tid, newTaxPayer);
  };

  // Retrieve all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer record by TID
  public query func getTaxPayerByTID(tid: Text) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Update an existing TaxPayer record
  public func updateTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async Bool {
    switch (taxPayers.get(tid)) {
      case (null) { false };
      case (?existingTaxPayer) {
        let updatedTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxPayers.put(tid, updatedTaxPayer);
        true
      };
    }
  };

  // Delete a TaxPayer record
  public func deleteTaxPayer(tid: Text) : async Bool {
    switch (taxPayers.remove(tid)) {
      case (null) { false };
      case (?_) { true };
    }
  };
}
