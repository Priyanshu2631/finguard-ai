package finguard_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class FraudResponse {

    @JsonProperty("is_fraud")
    private boolean fraud;

    @JsonProperty("fraud_probability")
    private double fraudProbability;

    @JsonProperty("risk_indicators")
    private List<String> riskIndicators;

    public FraudResponse() {
    }

    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
    }

    public double getFraudProbability() {
        return fraudProbability;
    }

    public void setFraudProbability(double fraudProbability) {
        this.fraudProbability = fraudProbability;
    }

    public List<String> getRiskIndicators() {
        return riskIndicators;
    }

    public void setRiskIndicators(List<String> riskIndicators) {
        this.riskIndicators = riskIndicators;
    }
}