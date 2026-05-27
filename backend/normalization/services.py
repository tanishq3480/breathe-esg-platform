from normalization.models import NormalizedActivity


EMISSION_FACTORS = {
    "diesel": 2.68
}


class UnitNormalizer:

    @staticmethod
    def normalize(value, unit):

        if unit == "L":
            return value, "liters"

        return value, unit


class ValidationEngine:

    @staticmethod
    def negative_value(value):
        return value < 0


def calculate_emissions(category, value):

    factor = EMISSION_FACTORS.get(category)

    if not factor:
        return 0

    return value * factor


def normalize_sap_record(raw_record):

    payload = raw_record.raw_payload

    fuel_qty = float(
        payload["Fuel Qty"]
    )

    unit = payload["Unit"]

    normalized_value, normalized_unit = (
        UnitNormalizer.normalize(
            fuel_qty,
            unit
        )
    )

    emissions = calculate_emissions(
        "diesel",
        normalized_value
    )

    suspicious = False

    if ValidationEngine.negative_value(
        normalized_value
    ):
        suspicious = True

    NormalizedActivity.objects.create(

        tenant=raw_record.tenant,

        raw_record=raw_record,

        category="Fuel",

        scope="SCOPE_1",

        activity_value=normalized_value,

        normalized_unit=normalized_unit,

        emission_factor=2.68,

        emissions_kg_co2e=emissions,

        suspicious=suspicious
    )