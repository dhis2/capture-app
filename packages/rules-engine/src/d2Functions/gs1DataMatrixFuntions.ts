const gs1Elements = new Map();
gs1Elements.set('GS1_E0_IDENTIFIER', ']E0'); // EAN-13, UPC-A, UPC-E
gs1Elements.set('GS1_E1_IDENTIFIER', ']E1'); // Two-digit add-on symbol
gs1Elements.set('GS1_E2_IDENTIFIER', ']E2'); // Five-digit add-on symbol
gs1Elements.set('GS1_E3_IDENTIFIER', ']E3'); // EAN-13, UPC-A, UPC-E with add-on symbol
gs1Elements.set('GS1_E4_IDENTIFIER', ']E4'); // EAN-8
gs1Elements.set('GS1_I1_IDENTIFIER', ']I1'); // ITF-14
gs1Elements.set('GS1_C1_IDENTIFIER', ']C1'); // GS1-128
gs1Elements.set('GS1_e0_IDENTIFIER', ']e0'); // GS1 DataBar
gs1Elements.set('GS1_e1_IDENTIFIER', ']e1'); // GS1 Composite
gs1Elements.set('GS1_e2_IDENTIFIER', ']e2'); // GS1 Composite
gs1Elements.set('GS1_d2_IDENTIFIER', ']d2'); // GS1 DataMatrix
gs1Elements.set('GS1_Q3_IDENTIFIER', ']Q3'); // GS1 QR Code
gs1Elements.set('GS1_J1_IDENTIFIER', ']J1'); // GS1 DotCode
gs1Elements.set('GS1_d1_IDENTIFIER', ']d1'); // Data Matrix implementing ECC 200
gs1Elements.set('GS1_Q1_IDENTIFIER', ']Q1'); // QR Code
gs1Elements.set('GS1_GROUP_SEPARATOR', '\u001d');
gs1Elements.set('SSCC', '00');
gs1Elements.set('GTIN', '01');
gs1Elements.set('CONTENT', '02');
gs1Elements.set('LOT_NUMBER', '10');
gs1Elements.set('PROD_DATE', '11');
gs1Elements.set('DUE_DATE', '12');
gs1Elements.set('PACK_DATE', '13');
gs1Elements.set('BEST_BEFORE_DATE', '15');
gs1Elements.set('SELL_BY', '16');
gs1Elements.set('EXP_DATE', '17');
gs1Elements.set('VARIANT', '20');
gs1Elements.set('SERIAL_NUMBER', '21');
gs1Elements.set('CPV', '22');
gs1Elements.set('TPX', '235');
gs1Elements.set('ADDITIONAL_ID', '240');
gs1Elements.set('CUSTOMER_PART_NUMBER', '241');
gs1Elements.set('MTO_VARIANT_NUMBER', '242');
gs1Elements.set('PCN', '243');
gs1Elements.set('SECONDARY_SERIAL', '250');
gs1Elements.set('REF_TO_SOURCE', '251');
gs1Elements.set('GDTI', '253');
gs1Elements.set('GLN_EXTENSION_COMPONENT', '254');
gs1Elements.set('GCN', '255');
gs1Elements.set('VAR_COUNT', '30');
gs1Elements.set('NET_WEIGHT_KG', '310*');
gs1Elements.set('LENGTH_M', '311*');
gs1Elements.set('WIDTH_M', '312*');
gs1Elements.set('HEIGHT_M', '313*');
gs1Elements.set('AREA_M2', '314*');
gs1Elements.set('NET_VOLUME_L', '315*');
gs1Elements.set('NET_VOLUME_M3', '316*');
gs1Elements.set('NET_WEIGHT_LB', '320*');
gs1Elements.set('LENGTH_I', '321*');
gs1Elements.set('LENGTH_F', '322*');
gs1Elements.set('LENGTH_Y', '323*');
gs1Elements.set('WIDTH_I', '324*');
gs1Elements.set('WIDTH_F', '325*');
gs1Elements.set('WIDTH_Y', '326*');
gs1Elements.set('HEIGHT_I', '327*');
gs1Elements.set('HEIGHT_F', '328*');
gs1Elements.set('HEIGHT_Y', '329*');
gs1Elements.set('GROSS_WEIGHT_GF', '330*');
gs1Elements.set('LENGTH_M_LOG', '331*');
gs1Elements.set('WIDTH_M_LOG', '332*');
gs1Elements.set('HEIGHT_M_LOG', '333*');
gs1Elements.set('AREA_M2_LOG', '334*');
gs1Elements.set('VOLUME_L_LOG', '335*');
gs1Elements.set('VOLUME_M3_LOG', '336*');
gs1Elements.set('KG_PER_M2', '337*');
gs1Elements.set('GROSS_WHEIGHT_LB', '340*');
gs1Elements.set('LENGTH_I_LOG', '341*');
gs1Elements.set('LENGTH_F_LOG', '342*');
gs1Elements.set('LENGTH_Y_LOG', '343*');
gs1Elements.set('WIDTH_I_LOG', '344*');
gs1Elements.set('WIDTH_F_LOG', '345*');
gs1Elements.set('WIDTH_Y_LOG', '346*');
gs1Elements.set('HEIGHT_I_LOG', '347*');
gs1Elements.set('HEIGHT_F_LOG', '348*');
gs1Elements.set('HEIGHT_Y_LOG', '349*');
gs1Elements.set('AREA_I2', '350*');
gs1Elements.set('AREA_F2', '351*');
gs1Elements.set('AREA_Y2', '352*');
gs1Elements.set('AREA_I2_LOG', '353*');
gs1Elements.set('AREA_F2_LOG', '354*');
gs1Elements.set('AREA_Y2_LOG', '355*');
gs1Elements.set('NET_WEIGHT_T', '356*');
gs1Elements.set('NET_VOLUME_OZ', '357*');
gs1Elements.set('NET_VOLUME_Q', '360*');
gs1Elements.set('NET_VOLUME_G', '361*');
gs1Elements.set('VOLUME_Q_LOG', '362*');
gs1Elements.set('VOLUME_G_LOG', '363*');
gs1Elements.set('VOLUME_I3', '364*');
gs1Elements.set('VOLUME_F3', '365*');
gs1Elements.set('VOLUME_Y3', '366*');
gs1Elements.set('VOLUME_I3_LOG', '367*');
gs1Elements.set('VOLUME_F3_LOG', '368*');
gs1Elements.set('VOLUME_Y3_LOG', '369*');
gs1Elements.set('COUNT', '37');
gs1Elements.set('AMOUNT', '390*');
gs1Elements.set('AMOUNT_ISO', '391*');
gs1Elements.set('PRICE', '392*');
gs1Elements.set('PRICE_ISO', '393*');
gs1Elements.set('PRCNT_OFF', '394*');
gs1Elements.set('PRICE_UOM', '395*');
gs1Elements.set('ORDER_NUMBER', '400');
gs1Elements.set('GINC', '401');
gs1Elements.set('ROUTE', '403');
gs1Elements.set('SHIP_TO_GLOB_LOC', '410');
gs1Elements.set('BILL_TO_LOC', '411');
gs1Elements.set('PURCHASED_FROM', '412');
gs1Elements.set('SHIP_FOR_LOG', '413');
gs1Elements.set('LOC_NUMBER', '414');
gs1Elements.set('PAY_TO', '415');
gs1Elements.set('PROD_SERV_LOC', '416');
gs1Elements.set('PARTY', '417');
gs1Elements.set('SHIP_TO_POST', '420');
gs1Elements.set('SHIP_TO_POST_ISO', '421');
gs1Elements.set('ORIGIN', '422');
gs1Elements.set('COUNTRY_INITIAL_PROCESS', '423');
gs1Elements.set('COUNTRY_PROCESS', '424');
gs1Elements.set('COUNTRY_DISASSEMBLY', '425');
gs1Elements.set('COUNTRY_FULL_PROCESS', '426');
gs1Elements.set('ORIGIN_SUBDIVISION', '427');
gs1Elements.set('SHIP_TO_COMP', '4300');
gs1Elements.set('SHIP_TO_NAME', '4301');
gs1Elements.set('SHIP_TO_ADD1', '4302');
gs1Elements.set('SHIP_TO_ADD2', '4303');
gs1Elements.set('SHIP_TO_SUB', '4304');
gs1Elements.set('SHIP_TO_LOCALITY', '4305');
gs1Elements.set('SHIP_TO_REG', '4306');
gs1Elements.set('SHIP_TO_COUNTRY', '4307');
gs1Elements.set('SHIP_TO_PHONE', '4308');
gs1Elements.set('RTN_TO_COMP', '4310');
gs1Elements.set('RTN_TO_NAME', '4311');
gs1Elements.set('RTN_TO_ADD1', '4312');
gs1Elements.set('RTN_TO_ADD2', '4313');
gs1Elements.set('RTN_TO_SUB', '4314');
gs1Elements.set('RTN_TO_LOCALITY', '4315');
gs1Elements.set('RTN_TO_REG', '4316');
gs1Elements.set('RTN_TO_COUNTRY', '4317');
gs1Elements.set('RTN_TO_POST', '4318');
gs1Elements.set('RTN_TO_PHONE', '4319');
gs1Elements.set('SRV_DESCRIPTION', '4320');
gs1Elements.set('DANGEROUS_GOODS', '4321');
gs1Elements.set('AUTH_LEAV', '4322');
gs1Elements.set('SIG_REQUIRED', '4323');
gs1Elements.set('NBEF_DEL_DT', '4324');
gs1Elements.set('NAFT_DEL_DT', '4325');
gs1Elements.set('REL_DATE', '4326');
gs1Elements.set('NSN', '7001');
gs1Elements.set('MEAT_CUT', '7002');
gs1Elements.set('EXP_TIME', '7003');
gs1Elements.set('ACTIVE_POTENCY', '7004');
gs1Elements.set('CATCH_AREA', '7005');
gs1Elements.set('FIRST_FREEZE_DATE', '7006');
gs1Elements.set('HARVEST_DATE', '7007');
gs1Elements.set('AQUATIC_SPECIES', '7008');
gs1Elements.set('FISHING_GEAR_TYPE', '7009');
gs1Elements.set('PROD_METHID', '7010');
gs1Elements.set('REFURB_LOT', '7020');
gs1Elements.set('FUNC_STAT', '7021');
gs1Elements.set('REV_STAT', '7022');
gs1Elements.set('GIAI_ASSEMBLY', '7023');
gs1Elements.set('PROCESSOR_NUMBER', '703*');
gs1Elements.set('UIC_EXT', '7040');
gs1Elements.set('NHRN_PZN', '710');
gs1Elements.set('NHRN_CIP', '711');
gs1Elements.set('NHRN_CN', '712');
gs1Elements.set('NHRN_DRN', '713');
gs1Elements.set('NHRN_AIM', '714');
gs1Elements.set('CERT_NUMBER', '723*');
gs1Elements.set('PROTOCOL', '7240');
gs1Elements.set('DIMENSIONS', '8001');
gs1Elements.set('CMT_NUMBER', '8002');
gs1Elements.set('GRAI', '8003');
gs1Elements.set('GIAI', '8004');
gs1Elements.set('PRICE_PER_UNIT', '8005');
gs1Elements.set('ITIP', '8006');
gs1Elements.set('IBAN', '8007');
gs1Elements.set('PROD_TIME', '8008');
gs1Elements.set('OPTSEN', '8009');
gs1Elements.set('CPID', '8010');
gs1Elements.set('CPID_SERIAL', '8011');
gs1Elements.set('VERSION', '8012');
gs1Elements.set('GMN', '8013');
gs1Elements.set('GSRN_PROVIDER', '8017');
gs1Elements.set('GSRN_RECIPIENT', '8018');
gs1Elements.set('SRIN', '8019');
gs1Elements.set('REF_NUMBER', '8020');
gs1Elements.set('ITIP_CONTENT', '8026');
gs1Elements.set('COUPON_USA', '8110');
gs1Elements.set('POINTS', '8111');
gs1Elements.set('POSITIVE_OFFER_COUPON_USA', '8121');
gs1Elements.set('PRODUCT_URL', '8200');
gs1Elements.set('AGREEMENT_INTERNAL', '90');
gs1Elements.set('COMPANY_INTERNAL_1', '91');
gs1Elements.set('COMPANY_INTERNAL_2', '92');
gs1Elements.set('COMPANY_INTERNAL_3', '93');
gs1Elements.set('COMPANY_INTERNAL_4', '94');
gs1Elements.set('COMPANY_INTERNAL_5', '95');
gs1Elements.set('COMPANY_INTERNAL_6', '96');
gs1Elements.set('COMPANY_INTERNAL_7', '97');
gs1Elements.set('COMPANY_INTERNAL_8', '98');
gs1Elements.set('COMPANY_INTERNAL_9', '99');

const aiFixedLengthMap = {
    [gs1Elements.get('SSCC')]: 20,
    [gs1Elements.get('GTIN')]: 16,
    [gs1Elements.get('CONTENT')]: 16,
    '03': 16,
    '04': 18,
    [gs1Elements.get('PROD_DATE')]: 8,
    [gs1Elements.get('DUE_DATE')]: 8,
    [gs1Elements.get('PACK_DATE')]: 8,
    14: 8,
    [gs1Elements.get('BEST_BEFORE_DATE')]: 8,
    [gs1Elements.get('SELL_BY')]: 8,
    [gs1Elements.get('EXP_DATE')]: 8,
    18: 8,
    19: 8,
    [gs1Elements.get('VARIANT')]: 4,
    31: 10,
    32: 10,
    33: 10,
    34: 10,
    35: 10,
    36: 10,
    41: 16,
};

const removeGS1Identifier = value => value.substring(3);

const getApplicationIdentifier = (gs1Group) => {
    for (let ai of gs1Elements.values()) {
        if (ai.endsWith('*')) {
            ai = ai.substring(0, ai.length - 1);
        }
        if (gs1Group.startsWith(ai) && ai.endsWith('*')) {
            return gs1Group.substring(0, ai.length + 1);
        } else if (gs1Group.startsWith(ai)) {
            return ai;
        }
    }
    return false;
};

const translateKey = (keyToTranslate) => {
    switch (keyToTranslate) {
    case 'gtin':
        return 'GTIN';
    case 'lot number':
    case 'batch number':
        return 'LOT_NUMBER';
    case 'production date':
        return 'PROD_DATE';
    case 'best before date':
        return 'BEST_BEFORE_DATE';
    case 'expiration date':
        return 'EXP_DATE';
    case 'serial number':
        return 'SERIAL_NUMBER';
    default:
        return keyToTranslate;
    }
};

let dataMap;

const handleGroupData = (gs1Group) => {
    if (gs1Group) {
        const gs1GroupLength = gs1Group.length;
        const ai = getApplicationIdentifier(gs1Group);
        let nextValueLength = aiFixedLengthMap[ai.substring(0, 2)];
        if (nextValueLength == null) {
            nextValueLength = gs1GroupLength;
        }

        dataMap.set(ai, gs1Group.substring(ai.length, nextValueLength));
        handleGroupData(gs1Group.substring(nextValueLength));
    }
};

const dataMatrixMappedCache = {};

const extractGS1DataMatrixValue = (key, dataMatrix) => {
    const keyToReturn = translateKey(key);
    const ai = gs1Elements.get(keyToReturn);

    if (dataMatrixMappedCache[dataMatrix]) {
        return dataMatrixMappedCache[dataMatrix].get(ai);
    }

    dataMap = new Map();

    const gs1Groups = removeGS1Identifier(dataMatrix).split(gs1Elements.get('GS1_GROUP_SEPARATOR'));
    gs1Groups.forEach((gs1Group) => {
        handleGroupData(gs1Group);
    });

    dataMatrixMappedCache[dataMatrix] = dataMap;

    return dataMap.get(ai);
};

export const extractDataMatrixValue = (key, dataMatrix) => {
    if (dataMatrix && dataMatrix.length >= 3) {
        const gs1Identifier = dataMatrix.substring(0, 3);
        if (gs1Elements.get('GS1_d2_IDENTIFIER') === gs1Identifier
            || gs1Elements.get('GS1_Q3_IDENTIFIER') === gs1Identifier) {
            const dataMatrixValue = extractGS1DataMatrixValue(key, dataMatrix);
            return dataMatrixValue;
        }
        return 'Unsupported GS1 identifier: {gs1Identifier}';
    }
    return 'Incomplete DataMatrix input';
};
